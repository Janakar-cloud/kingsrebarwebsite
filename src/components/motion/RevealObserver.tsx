"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const reducedMotion = "(prefers-reduced-motion: reduce)";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Elements already on screen when the page renders are left alone, so the
 * reveal never hides content the visitor can already see. Each element
 * reveals once and is then unobserved.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia(reducedMotion).matches || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal-state", "shown");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const viewportBottom = window.innerHeight;
    const candidates = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-state="shown"])');
    for (const element of candidates) {
      if (element.dataset.revealState === "pending") {
        observer.observe(element);
      } else if (element.getBoundingClientRect().top < viewportBottom) {
        element.setAttribute("data-reveal-state", "shown");
      } else {
        element.setAttribute("data-reveal-state", "pending");
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
