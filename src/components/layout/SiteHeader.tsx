import Link from "next/link";

import { PreviewBanner } from "@/components/content/Pending";
import { navigation, routes } from "@/content/routes";
import { MainNav } from "./MainNav";
import { Wordmark } from "./Wordmark";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <PreviewBanner />
      <header className={styles.header} data-tone="dark">
        <div className={`container ${styles.bar}`}>
          <Wordmark priority />
          <div className={styles.actions}>
            <Link href={routes.contact} className={styles.quickCta}>
              Enquire
            </Link>
            <MainNav items={navigation} />
          </div>
        </div>
      </header>
    </>
  );
}
