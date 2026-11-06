# Kings Rebar website

Company website for Kings Rebar Private Limited: six pages (Home, About,
Services, Industries, Careers, Contact) and an enquiry form.

Built with Next.js 16 (App Router, TypeScript, Cache Components) and plain CSS
modules. There are no runtime dependencies beyond Next.js and React.

> **Content status:** company copy, services, locations, careers, the public
> email, logo and founder portrait are in `src/content/` and `public/images/`.
> Remaining gaps (privacy notice, form destination, domain) are listed in
> [docs/CONTENT_CHECKLIST.md](./docs/CONTENT_CHECKLIST.md).
> `/products` redirects to `/services`. `/quality-responsibility` redirects to `/careers`.

## Commands

Requires Node.js 20.9 or later.

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm install`       | Install dependencies                                       |
| `npm run dev`       | Development server on http://localhost:3000                |
| `npm run build`     | Production build                                           |
| `npm start`         | Serve the production build (`npx next start -p 8080` to change port) |
| `npm run lint`      | ESLint                                                     |
| `npm run typecheck` | Generate route types and run `tsc --noEmit`               |
| `npm test`          | Unit tests (Node's built-in test runner, no extra dependencies) |
| `npm run check`     | Lint, type-check and unit tests                            |
| `npm run test:e2e`  | End-to-end tests in a real browser, against production and review builds (stop `npm run dev` first) |
| `npm run test:e2e:production` / `test:e2e:review` | Run one of the two end-to-end builds |

## Where things live

```
src/app/                      Routes (one folder per page), API route, metadata files
src/app/api/enquiry/          POST endpoint used by the form
src/components/               layout/ (header, footer), sections/, content/, ui/, seo/
src/features/enquiry/         Form, validation and server-side delivery
src/content/site.ts           Company name, contact channels, assets, social, analytics, form settings
src/content/routes.ts         Navigation and public paths
src/content/locations.ts      Shared offices and markets
src/content/pages/            Copy and metadata for each route
src/content/types.ts          pending()/isApproved() helpers and shared content types
src/config/                   Deployment settings (env.ts) and fonts
src/lib/                      Small shared helpers (cn, seo)
src/styles/                   Design tokens, layout, motion and global component styles
public/images/                Approved images
tests/                        Unit tests, mirroring src/ (tests/support holds the loader)
e2e/                          Browser tests: production/ (what visitors get) and review/ (form, placeholders on)
docs/                         Technical specification and content checklist
Kings_Rebar_Assests/          Original client source files and briefs (not part of the build)
```

### Editing content

Replace a `pending("...")` value with the approved text, for example:

```ts
intro: pending("Add an approved introduction to Kings Rebar here.") as Approved<string>,
// becomes
intro: "Approved introduction text supplied by Kings Rebar.",
```

Edit the matching file under `src/content/pages/` (for example `services.ts`
or `careers.ts`). Add only confirmed entries. Do not add placeholder products,
certifications or unnamed clients.

### Placeholder behaviour

- **Development (`npm run dev`)** shows each pending item as a dashed yellow
  "Content needed" box, plus a banner at the top of every page.
- **Production builds** hide all pending items. Sections with no approved
  content are omitted, and pages fall back to a short, neutral "please contact
  Kings Rebar" line.
- **Client review builds**: set `SHOW_CONTENT_PLACEHOLDERS=true` before
  `npm run build` so reviewers can see what is still missing on a deployed copy.

### Images

The image set was approved on 22 Oct 2026: client logo, lion mark, founder
portrait, and original SVG steel graphics. Do not add generated people, offices,
projects, or certificates. Optional extra photographs go in `public/images/`
and are referenced from `src/content/` only after they are supplied.

| Slot                       | Where to set it                        | Size / format                                |
| -------------------------- | -------------------------------------- | -------------------------------------------- |
| Logo                       | `site.assets.logo`                     | Transparent PNG lockup at `/images/logo.png` |
| Lion mark                  | `site.assets.mark`                     | Circular seal on the home hero               |
| Founder portrait           | `about.founder.image`                  | `/images/founder-vigneshwaran.jpg`           |
| Page heroes                | `heroImage` in each `src/content/pages/*.ts` | `kr-services.jpg`, `kr-careers.jpg`, `kr-contact.png`, `hero-industries.jpg` |
| Locations map              | `locationsMap` in `src/content/locations.ts` (Home and About) | `/images/tamil-nadu-offices-map.png` |
| Home hero                  | `home.hero.image`                      | Optional photo; until then, rebar graphic + seal |
| Social sharing image       | `src/app/opengraph-image.tsx`          | 1200×630 card generated from the logo        |
| Browser icon               | `src/app/icon.png`                     | Square PNG from the lion mark                |

Images use `ImageAsset` (`src`, `alt`, `width`, `height`). Write `alt` text that
describes the image. Use `alt: ""` only for purely decorative images. The header
and footer use the approved Kings Rebar lockup.

## Enquiry form

The form validates in the browser and again on the server
(`src/features/enquiry/validation.ts`), then posts JSON to `/api/enquiry`.

The route counts an enquiry as sent **only** when the configured destination
returns a 2xx response. Submissions are not stored or logged, and server logs
record only failure categories, never the submitted content.

| Situation                                         | Result                                                         |
| ------------------------------------------------- | -------------------------------------------------------------- |
| Development, no email or webhook configured      | "Development only: not sent" notice; nothing leaves the machine |
| Production, no destination or no approved privacy notice | 503; the visitor sees the recoverable failure message     |
| Destination returns non-2xx, times out (10 s) or is unreachable | 502; failure message, form contents kept            |
| Destination returns 2xx                           | Success confirmation                                           |

The form is shown in production because `site.enquiry.privacyNotice` is set
(operational UAT wording: enquiries are emailed to `info@kingsrebar.com`). To
check the outcome screens in development without a destination, set
`ENQUIRY_DEV_SIMULATE=success` or `failure` (ignored in production).

**Delivery:** `deliverEnquiry()` in `src/features/enquiry/deliver.ts` sends a
plain-text email to `info@kingsrebar.com` (overridable with `ENQUIRY_TO_EMAIL`),
from the same Outlook mailbox, with the visitor's address as Reply-To.

1. **Outlook / Microsoft 365 (UAT and production).** Pick one:
   - **Microsoft Graph (recommended on Vercel).** Create an Azure AD app with
     application permission `Mail.Send` (admin consent), then set
     `OUTLOOK_TENANT_ID`, `OUTLOOK_CLIENT_ID` and `OUTLOOK_CLIENT_SECRET`. The
     app sends as `OUTLOOK_MAILBOX` (defaults to `info@kingsrebar.com`).
   - **SMTP AUTH (typical locally).** Set `OUTLOOK_SMTP_PASSWORD` to the mailbox
     password or an app password if MFA is on. Authenticated SMTP must be
     enabled for the mailbox. Host defaults to `smtp.office365.com:587`.
2. **Resend fallback.** Used only when neither Outlook option is fully set
   (`RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL`).
3. **Webhook fallback.** If no email option is set, POSTs JSON to
   `ENQUIRY_WEBHOOK_URL`.

Keep every credential in server-side environment variables. Never use a
`NEXT_PUBLIC_` prefix for secrets.

Spam protection is minimal: a hidden honeypot field, a same-origin check and a
size limit. If spam becomes a problem, add rate limiting or a CAPTCHA at the
host or form provider.

## Environment variables

See [.env.example](./.env.example). Copy it to `.env.local` and set
`OUTLOOK_SMTP_PASSWORD` (or the Graph app credentials) so local enquiry
submissions reach `info@kingsrebar.com`.

| Name                        | Scope       | Purpose                                                                        |
| --------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `SITE_URL`                  | Build       | Production origin, e.g. `https://www.example.com`. Enables canonical URLs, absolute Open Graph URLs, sitemap entries and Organization structured data |
| `ALLOW_INDEXING`            | Build       | `true` only on the live site after content approval. Otherwise every page is `noindex` and robots.txt disallows everything |
| `OUTLOOK_MAILBOX`           | Server only | Outlook mailbox used as sender (defaults to `info@kingsrebar.com`)             |
| `OUTLOOK_TENANT_ID` / `OUTLOOK_CLIENT_ID` / `OUTLOOK_CLIENT_SECRET` | Server only | Microsoft Graph app; preferred on Vercel |
| `OUTLOOK_SMTP_PASSWORD`     | Server only | Outlook mailbox password or app password (SMTP AUTH)                           |
| `ENQUIRY_TO_EMAIL`          | Server only | Optional recipient override (defaults to `info@kingsrebar.com`)                |
| `RESEND_API_KEY`            | Server only | Fallback sender if Outlook is not configured                                   |
| `ENQUIRY_FROM_EMAIL`        | Server only | Fallback Resend sender, or override for the Outlook From address               |
| `ENQUIRY_WEBHOOK_URL`       | Server only | Alternative delivery: JSON webhook, used when no email option is set           |
| `ENQUIRY_WEBHOOK_TOKEN`     | Server only | Optional bearer token for the webhook                                          |
| `SHOW_CONTENT_PLACEHOLDERS` | Build       | `true` to show pending-content boxes in a production build (client review)     |
| `ENQUIRY_DEV_SIMULATE`      | Dev only    | `success` / `failure` to preview form outcomes                                 |

Pages are prerendered, so **build-time variables need a rebuild** when they change.

## UAT on Vercel

This is a client demo, not the live site. Keep `ALLOW_INDEXING` unset so the
preview stays out of search.

1. Import the project on Vercel (Next.js is detected automatically).
2. In Vercel → Settings → Environment Variables, set at least:
   - `OUTLOOK_MAILBOX=info@kingsrebar.com`
   - `ENQUIRY_TO_EMAIL=info@kingsrebar.com`
   - either the Graph trio (`OUTLOOK_TENANT_ID`, `OUTLOOK_CLIENT_ID`,
     `OUTLOOK_CLIENT_SECRET`) **or** `OUTLOOK_SMTP_PASSWORD`
3. Do **not** set `ALLOW_INDEXING=true`. Optional: `SITE_URL` to the
   `*.vercel.app` URL (otherwise `VERCEL_URL` is used).
4. Redeploy after saving the variables, then submit a test enquiry and confirm
   it arrives in the `info@kingsrebar.com` Outlook inbox (and Sent Items if Graph
   `saveToSentItems` is on).

Graph is the more reliable path on Vercel. SMTP AUTH on port 587 can be blocked
or slow from serverless regions.

## Deployment

1. Set the environment variables on the host. Do not use placeholder or invented
   credentials. For UAT, configure the Outlook mailbox as above.
2. Run `npm ci && npm run build`, then `npm start`. Alternatively, deploy to any
   Next.js-capable host (for example Vercel, or a Node.js server or container).
   The `/api/enquiry` route needs a server runtime, so a static export is not suitable.
3. **Domain:** point DNS at the host, set `SITE_URL` to the final `https://` origin, and rebuild.
4. **Indexing:** once the client has approved everything in the content checklist,
   set `ALLOW_INDEXING=true` and rebuild. Check `/robots.txt` and `/sitemap.xml`.
5. **Analytics:** none is installed. If the client approves a provider (and any
   consent banner or privacy wording it needs), set `site.analytics` to the
   provider's script URL and attributes. It loads through `next/script` in
   `src/app/layout.tsx`. Providers that need inline configuration (for example
   Google Analytics 4) should be added in that same place.

### Security and resilience

- `next.config.ts` sends `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` and
  `Strict-Transport-Security` on every response, and a Content Security Policy in
  production builds. The pages are prerendered, so scripts and styles need
  `'unsafe-inline'`; everything else is limited to the site's own origin.
- If `site.analytics` is configured, its script origin is added to the policy
  automatically at build time. Any other third-party embed (maps, video, chat)
  needs a matching change in `contentSecurityPolicy()`.
- `X-Powered-By` is disabled. Enquiry data is never logged or stored.
- `src/app/error.tsx` handles page failures with the header and footer intact;
  `src/app/global-error.tsx` is the last resort for root-layout failures.
- Add HTTPS redirects, `www`/apex handling and rate limiting at the host or CDN.
  Add `includeSubDomains` and `preload` to the HSTS header only once every
  subdomain of the final domain is confirmed to serve HTTPS.

### Launch checklist

1. Replace the UAT privacy notice with lawyer-reviewed copy if required for public launch.
2. Confirm Outlook delivery (Graph app or SMTP) and submit a real test enquiry
   that arrives at `info@kingsrebar.com`.
3. Set `SITE_URL=https://www.kingsrebar.com` and `ALLOW_INDEXING=true`, then rebuild.
4. Confirm `/robots.txt`, `/sitemap.xml`, canonical tags and the social card.
5. Submit the sitemap to Google Search Console.
6. Run `npm run check && npm run build` on the exact commit being deployed.

### Structured data

`src/components/seo/OrganizationJsonLd.tsx` outputs schema.org `Organization` data on
the home page, built only from approved values: name and URL always, plus logo,
email, phone, address and social profiles once approved. No business category,
ratings or opening hours are output.

## Testing

Two layers, both run before a release:

**Unit tests** (`npm test`, 114 tests, about one second): content integrity, image
files (declared sizes match the real files, no unused images), routing, SEO
metadata, sitemap and robots in each environment, environment parsing, security
headers, enquiry validation and delivery, and the API route in development and
production modes.

**End-to-end tests** (`npm run test:e2e`, 193 tests, about four minutes) drive
a real Chrome browser against a real `next build` + `next start`, in two passes
because deployment settings are baked in at build time:

- *production* (148 tests): every page for status, metadata, canonical URLs,
  headings, images, overflow at four screen sizes and no console errors;
  navigation (desktop, mobile menu, keyboard, redirects, 404); sitemap, robots,
  JSON-LD, security headers and the Content Security Policy running in the
  browser; the enquiry API under every rejection rule; link checking;
  automated WCAG 2.2 AA scans (axe) of every page on desktop and mobile;
  keyboard focus, reduced motion and JavaScript-disabled rendering.
- *review* (45 tests, placeholders on so the form is visible): field
  validation, the error summary, keyboard use, success, failure, retry, network
  errors, double-submit protection, the honeypot, script-injection text, and
  accessibility in every form state.

Chrome is used by default. Set `E2E_BROWSER_CHANNEL=msedge` for Edge, or leave
it empty to use Playwright's own browser after `npx playwright install chromium`.
Both builds use `.next`, so stop `npm run dev` before running them. Reports are
written to `playwright-report/`.

## Verification

Checks run on the initial build:

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` all pass
- All six routes return 200 and `/nope` returns 404
- Production output contains no pending-content markup
- Mobile menu, active-page state, Escape-to-close, skip link and focus styles checked
- No horizontal overflow at 320, 375, 768 and 1366 px
- Form validation, error summary, submitting, development "not sent", failure
  and success states exercised
- API: invalid input returns 422; cross-origin, honeypot, malformed and
  oversized requests are rejected; production returns 503 when no destination is set
- With `SITE_URL` and `ALLOW_INDEXING` set: canonical, Open Graph image,
  sitemap, robots and JSON-LD output checked

`npm run build` prints a `metadataBase` warning until `SITE_URL` is set. That is
expected: it is set at deployment (see Environment variables).

`npm audit` reports high-severity advisories in `eslint-config-next`'s
dependency tree (`braces` through `fast-glob`). These packages are dev-only lint
tooling and are not part of the deployed site. The suggested `--force` fix
downgrades to an incompatible version, so it was not applied.
