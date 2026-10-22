import Image from "next/image";
import Link from "next/link";

import { navigation, site } from "@/content/site";
import { isApproved } from "@/content/types";
import { MainNav } from "./MainNav";
import { PreviewBanner } from "./Pending";
import styles from "./SiteHeader.module.css";

export function Wordmark({ className }: { className?: string }) {
  const logo = site.assets.logo;
  return (
    <Link href="/" className={[styles.wordmark, className].filter(Boolean).join(" ")}>
      {isApproved(logo) ? (
        <Image src={logo.src} alt={logo.alt || site.companyName} width={logo.width} height={logo.height} priority />
      ) : (
        site.companyName
      )}
      <span className="visually-hidden">, home page</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <PreviewBanner />
      <div className={`container ${styles.bar}`}>
        <Wordmark />
        <MainNav items={navigation} />
      </div>
    </header>
  );
}
