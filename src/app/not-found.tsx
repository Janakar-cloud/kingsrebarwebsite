import type { Metadata } from "next";
import Link from "next/link";

import { navigation } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="section" aria-labelledby="not-found-heading">
      <div className="container stack">
        <h1 id="not-found-heading">Page not found</h1>
        <p className="lead">The page you are looking for does not exist or may have moved.</p>
        <nav aria-label="Site pages">
          <ul className="plain-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
