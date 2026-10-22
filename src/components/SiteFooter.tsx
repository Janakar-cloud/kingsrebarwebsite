import Link from "next/link";

import { navigation, site } from "@/content/site";
import { showPlaceholders } from "@/lib/env";
import { ContactDetails, hasApprovedContactDetails } from "./ContactDetails";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.wordmark}>{site.companyName}</p>
          <Link href="/contact" className={styles.cta}>
            Make an enquiry
          </Link>
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.heading}>Pages</h2>
          <ul className={styles.links}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {(showPlaceholders || hasApprovedContactDetails() || site.social.length > 0) && (
          <div>
            <h2 className={styles.heading}>Contact</h2>
            <ContactDetails className={styles.contact} />
            {site.social.length > 0 && (
              <ul className={styles.social} aria-label="Social media">
                {site.social.map((profile) => (
                  <li key={profile.url}>
                    <a href={profile.url} rel="noopener noreferrer">
                      {profile.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className={`container ${styles.legal}`}>
        <p>© {site.companyName}</p>
      </div>
    </footer>
  );
}
