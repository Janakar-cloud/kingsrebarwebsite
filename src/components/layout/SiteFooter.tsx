import Link from "next/link";
import type { CSSProperties } from "react";

import { ContactDetails, hasApprovedContactDetails } from "@/components/content/ContactDetails";
import { Icon } from "@/components/ui/Icon";
import { showPlaceholders } from "@/config/env";
import { navigation, routes } from "@/content/routes";
import { site } from "@/content/site";
import { Wordmark } from "./Wordmark";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
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

        {showContact && (
          <div className={`${styles.column} ${styles.contact}`}>
            <h2 className={styles.heading}>Contact</h2>
            <ContactDetails columns />
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
          </div>
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
