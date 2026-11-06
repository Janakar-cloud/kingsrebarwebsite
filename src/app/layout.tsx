import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { allowIndexing, siteUrl } from "@/config/env";
import { fontVariables } from "@/config/fonts";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl ?? undefined,
  title: {
    template: `%s | ${site.siteTitle}`,
    default: site.siteTitle,
  },
  description: site.siteDescription,
  applicationName: site.siteTitle,
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0f12",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language} className={fontVariables} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
        {site.analytics && (
          <Script src={site.analytics.scriptSrc} strategy="afterInteractive" {...site.analytics.attributes} />
        )}
      </body>
    </html>
  );
}
