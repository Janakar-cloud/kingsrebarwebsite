"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";

import { isActiveRoute, routes, type NavItem } from "@/content/routes";
import styles from "./SiteHeader.module.css";

export function MainNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Tracking the path the menu was opened on closes it automatically after navigation.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const close = () => setOpenOnPath(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenOnPath(null);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      close();
      buttonRef.current?.focus();
    }
  }

  function handleBlur(event: FocusEvent) {
    const next = event.relatedTarget as Node | null;
    if (open && next && !navRef.current?.contains(next)) close();
  }

  return (
    <nav ref={navRef} aria-label="Main" className={styles.nav} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpenOnPath(open ? null : pathname)}
      >
        <span className={styles.menuIcon} aria-hidden="true" data-open={open} />
        <span>Menu</span>
      </button>
      <div className={styles.backdrop} data-open={open} aria-hidden="true" />
      <ul id={listId} className={styles.navList} data-open={open}>
        {items.map((item, index) => {
          const active = isActiveRoute(pathname, item.href);
          const isContact = item.href === routes.contact;
          return (
            <li key={item.href} className={styles.navItem} style={{ "--nav-index": index } as CSSProperties}>
              <Link
                href={item.href}
                className={isContact ? `${styles.navLink} ${styles.navCta}` : styles.navLink}
                aria-current={active ? "page" : undefined}
                onClick={close}
              >
                <span className={styles.navIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
