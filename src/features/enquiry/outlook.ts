import { once } from "node:events";
import { connect as connectTcp, type Socket } from "node:net";
import { connect as connectTls, type TLSSocket } from "node:tls";

const REQUEST_TIMEOUT_MS = 10_000;
const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const DEFAULT_SMTP_HOST = "smtp.office365.com";
const DEFAULT_SMTP_PORT = 587;

export type OutlookGraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  mailbox: string;
  to: string;
};

export type OutlookSmtpConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
  to: string;
};

export type OutlookMessage = {
  subject: string;
  text: string;
  replyTo: string;
};

type GraphToken = { value: string; expiresAt: number };

let cachedToken: GraphToken | null = null;

function tokenUrl(tenantId: string) {
  return `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
}

function sendMailUrl(mailbox: string) {
  return `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`;
}

async function postForm(url: string, body: URLSearchParams): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
}

/** Application-permission token for Microsoft Graph, cached until shortly before it expires. */
export async function getGraphToken(config: OutlookGraphConfig): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  try {
    const response = await postForm(
      tokenUrl(config.tenantId),
      new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "client_credentials",
        scope: GRAPH_SCOPE,
      }),
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!payload.access_token) return null;
    cachedToken = {
      value: payload.access_token,
      expiresAt: now + Math.max(60, Number(payload.expires_in) || 3600) * 1000,
    };
    return cachedToken.value;
  } catch {
    return null;
  }
}

/** Clears the cached Graph token. Used by tests. */
export function resetGraphTokenCache() {
  cachedToken = null;
}

export async function sendOutlookGraphMail(
  config: OutlookGraphConfig,
  message: OutlookMessage,
): Promise<"sent" | "failed"> {
  const token = await getGraphToken(config);
  if (!token) return "failed";

  try {
    const response = await fetch(sendMailUrl(config.mailbox), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: message.subject,
          body: { contentType: "Text", content: message.text },
          toRecipients: [{ emailAddress: { address: config.to } }],
          replyTo: [{ emailAddress: { address: message.replyTo } }],
        },
        saveToSentItems: true,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

function encodeHeader(value: string) {
  if (/^[\x20-\x7e]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

export function buildSmtpData(from: string, to: string, message: OutlookMessage): string {
  const body = Buffer.from(message.text.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n"), "utf8").toString("base64");
  const wrapped = body.replace(/(.{1,76})/g, "$1\r\n").trimEnd();
  return [
    `From: Kings Rebar Website <${from}>`,
    `To: ${to}`,
    `Reply-To: ${message.replyTo}`,
    `Subject: ${encodeHeader(message.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    wrapped,
    "",
  ].join("\r\n");
}

class SmtpConversation {
  private buffer = "";
  private socket: Socket | TLSSocket;

  constructor(socket: Socket | TLSSocket) {
    this.socket = socket;
    this.socket.on("data", (chunk: Buffer | string) => {
      this.buffer += typeof chunk === "string" ? chunk : chunk.toString("utf8");
    });
  }

  async reply(): Promise<{ code: number; text: string }> {
    const deadline = Date.now() + REQUEST_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const match = this.buffer.match(/^(?:[0-9]{3}-[^\r\n]*\r?\n)*([0-9]{3})[ ][^\r\n]*\r?\n/m);
      if (match && match.index === 0) {
        const text = match[0];
        this.buffer = this.buffer.slice(text.length);
        return { code: Number(match[1]), text };
      }
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    throw new Error("SMTP timed out waiting for a reply");
  }

  async command(line: string, expected: number | readonly number[]) {
    this.socket.write(`${line}\r\n`);
    const reply = await this.reply();
    const allowed = typeof expected === "number" ? [expected] : expected;
    if (!allowed.includes(reply.code)) {
      throw new Error(`SMTP ${line.split(" ")[0]} failed (${reply.code})`);
    }
    return reply;
  }
}

/**
 * Sends one plain-text message through Microsoft 365 / Outlook SMTP
 * (STARTTLS on port 587, AUTH LOGIN). Used when a mailbox password is set
 * and no Graph app is configured. Prefer Graph on serverless hosts.
 */
export async function sendOutlookSmtpMail(
  config: OutlookSmtpConfig,
  message: OutlookMessage,
): Promise<"sent" | "failed"> {
  let tcp: ReturnType<typeof connectTcp> | undefined;
  let tlsSocket: ReturnType<typeof connectTls> | undefined;

  try {
    tcp = connectTcp({ host: config.host, port: config.port });
    tcp.setTimeout(REQUEST_TIMEOUT_MS);
    const greeting = new SmtpConversation(tcp);
    await once(tcp, "connect");
    const hello = await greeting.reply();
    if (hello.code !== 220) throw new Error("SMTP greeting failed");
    await greeting.command("EHLO kingsrebar.com", 250);
    await greeting.command("STARTTLS", 220);
    tcp.removeAllListeners("data");

    tlsSocket = connectTls({ socket: tcp, servername: config.host });
    tlsSocket.setTimeout(REQUEST_TIMEOUT_MS);
    const secure = new SmtpConversation(tlsSocket);
    await once(tlsSocket, "secureConnect");
    await secure.command(`EHLO kingsrebar.com`, 250);
    await secure.command("AUTH LOGIN", 334);
    await secure.command(Buffer.from(config.user, "utf8").toString("base64"), 334);
    await secure.command(Buffer.from(config.password, "utf8").toString("base64"), 235);
    await secure.command(`MAIL FROM:<${config.from}>`, 250);
    await secure.command(`RCPT TO:<${config.to}>`, [250, 251]);
    await secure.command("DATA", 354);
    tlsSocket.write(`${buildSmtpData(config.from, config.to, message)}\r\n.\r\n`);
    const dataReply = await secure.reply();
    if (dataReply.code !== 250) throw new Error("SMTP DATA failed");
    await secure.command("QUIT", [221, 250]);
    return "sent";
  } catch {
    return "failed";
  } finally {
    tlsSocket?.destroy();
    tcp?.destroy();
  }
}

export function defaultSmtpHost() {
  return DEFAULT_SMTP_HOST;
}

export function defaultSmtpPort() {
  return DEFAULT_SMTP_PORT;
}
