"use client";

import { useEffect } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { serverError } from "@/content/pages/shared";
import { routes } from "@/content/routes";
import styles from "./error.module.css";

/** Route-level error boundary. The header and footer stay in place around it. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // The digest matches this error to the server log entry; the message is never shown to visitors.
    const digest = error instanceof Error ? (error as Error & { digest?: string }).digest : undefined;
    console.error("Page render failed", digest ?? error);
  }, [error]);

  return (
    <section className={`${styles.hero} grain`} data-tone="dark" aria-labelledby="error-heading">
      <div className="container">
        <p className="eyebrow">Error</p>
        <h1 id="error-heading">{serverError.title}</h1>
        <p className="lead" role="alert">
          {serverError.body}
        </p>
        <div className={styles.actions}>
          <Button onClick={() => retry()} arrow>
            {serverError.retryLabel}
          </Button>
          <ButtonLink href={routes.contact} variant="secondary">
            Contact Kings Rebar
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
