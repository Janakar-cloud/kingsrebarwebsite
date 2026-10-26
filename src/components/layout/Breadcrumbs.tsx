import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { siteUrl } from "@/config/env";
import { navigation, type Route } from "@/content/routes";
import styles from "./Breadcrumbs.module.css";

/** Home › Current page trail, plus BreadcrumbList structured data when a production URL is set. */
export function Breadcrumbs({ current }: { current: Route }) {
  const page = navigation.find((item) => item.href === current);
  if (!page) return null;
  const trail = [navigation[0], page];
  const base = siteUrl;

  return (
    <>
      <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
        <ol>
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={item.href}>
                {last ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {base && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: trail.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.label,
              item: new URL(item.href, base).href,
            })),
          }}
        />
      )}
    </>
  );
}
