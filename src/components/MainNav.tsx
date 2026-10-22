"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import styles from "./SiteHeader.module.css";

type NavItem = { readonly href: string; readonly label: string };

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const listId = useId();
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Tracking the path the menu was opened on closes it automatically after navigation.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;

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
      setOpenOnPath(null);
      buttonRef.current?.focus();
    }
  }

  return (
    <nav ref={navRef} aria-label="Main" className={styles.nav} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpenOnPath(open ? null : pathname)}
      >
        <span className={styles.menuIcon} aria-hidden="true" data-open={open} />
        Menu
      </button>
      <ul id={listId} className={styles.navList} data-open={open}>
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.navLink}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpenOnPath(null)}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
