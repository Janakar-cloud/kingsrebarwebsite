import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { hasApprovedContactDetails } from "@/components/content/ContactDetails";
import { Icon } from "@/components/ui/Icon";
import { showPlaceholders } from "@/config/env";
import { navigation, routes } from "@/content/routes";
import { site } from "@/content/site";
import { publishedOrPreview } from "@/content/types";
import { Wordmark } from "./Wordmark";
import styles from "./SiteFooter.module.css";

const { contact } = site;

function visible<T>(value: Parameters<typeof publishedOrPreview<T>>[0]) {
  return publishedOrPreview(value, showPlaceholders);
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.column}>
      <h2 className={styles.heading}>{title}</h2>
      {children}
    </div>
  );
}

export function SiteFooter() {
  const email = visible(contact.email);
  const phone = visible(contact.phone);
  const address = visible(contact.address);
  const hours = visible(contact.hours);
  const website = visible(contact.website);
  const host = website?.replace(/^https?:\/\//, "");
  const showContact = showPlaceholders || hasApprovedContactDetails() || site.social.length > 0;

  return (
    <footer className={`${styles.footer} grain`} data-tone="dark">
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Wordmark size="lg" />
          <Link href={routes.contact} className={styles.cta}>
            Make an enquiry
            <Icon name="arrow" className={styles.ctaIcon} />
          </Link>
        </div>

        <nav aria-label="Footer" className={styles.column}>
          <h2 className={styles.heading}>Pages</h2>
          <ul className={styles.links}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {showContact && (email || phone || site.social.length > 0) && (
          <FooterColumn title="Contact">
            <dl className={styles.fields}>
              {email && (
                <div className={styles.field}>
                  <dt className={styles.label}>Email</dt>
                  <dd>
                    <a href={`mailto:${email}`}>{email}</a>
                  </dd>
                </div>
              )}
              {phone && (
                <div className={styles.field}>
                  <dt className={styles.label}>Phone</dt>
                  <dd>
                    <a href={telHref(phone)}>{phone}</a>
                  </dd>
                </div>
              )}
            </dl>
            {site.social.length > 0 && (
              <ul className={styles.links} aria-label="Social media">
                {site.social.map((profile) => (
                  <li key={profile.url}>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer">
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </FooterColumn>
        )}

        {showContact && address && (
          <FooterColumn title="Address">
            <address className={styles.address}>
              {address.lines.map((line) => (
                <span key={line} className={styles.line}>
                  {line}
                </span>
              ))}
            </address>
          </FooterColumn>
        )}

        {showContact && (hours || website) && (
          <FooterColumn title="Business hours">
            {hours && (
              <p className={styles.hours}>
                {hours.map((line) => (
                  <span key={line} className={styles.line}>
                    {line}
                  </span>
                ))}
              </p>
            )}
            {website && (
              <div className={styles.field}>
                <h2 className={styles.heading}>Website</h2>
                <a href={website} rel="noopener noreferrer">
                  {host}
                </a>
              </div>
            )}
          </FooterColumn>
        )}
      </div>

      <p className={styles.giant} aria-hidden="true" data-reveal="wordmark">
        {Array.from(site.companyName).map((character, index) =>
          character === " " ? (
            " "
          ) : (
            <span key={index} className={styles.letter} style={{ "--letter": index } as CSSProperties}>
              {character}
            </span>
          ),
        )}
      </p>

      <div className={`container ${styles.legal}`}>
        <p>© {site.companyName}</p>
        <a href="#main-content" className={styles.top}>
          Back to top
          <Icon name="arrowUp" />
        </a>
      </div>
    </footer>
  );
}
