import Image from "next/image";
import Link from "next/link";

import { site } from "@/content/site";
import { isApproved } from "@/content/types";
import { routes } from "@/content/routes";
import { cn } from "@/lib/cn";
import styles from "./Wordmark.module.css";

type Props = {
  className?: string;
  /** Load the logo immediately in the header; omit in the footer. */
  priority?: boolean;
  size?: "md" | "lg";
};

/** Approved logo lockup, with a typographic fallback if the file is removed. */
export function Wordmark({ className, priority = false, size = "md" }: Props) {
  const logo = site.assets.logo;
  const [first, ...rest] = site.companyName.split(" ");
  return (
    <Link href={routes.home} className={cn(styles.wordmark, className)}>
      {isApproved(logo) ? (
        <Image
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          sizes="180px"
          priority={priority}
          className={size === "lg" ? styles.logoLg : styles.logo}
        />
      ) : (
        <span className={styles.text} aria-hidden="true">
          <span className={styles.strong}>{first}</span> {rest.join(" ")}
        </span>
      )}
      <span className="visually-hidden">{site.companyName}, home page</span>
    </Link>
  );
}
