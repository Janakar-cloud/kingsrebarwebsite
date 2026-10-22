import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import { allowIndexing, siteUrl } from "@/lib/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
  themeColor: "#1f2a36",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language} className={geistSans.variable}>
      <body>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
        {site.analytics && (
          <Script src={site.analytics.scriptSrc} strategy="afterInteractive" {...site.analytics.attributes} />
        )}
      </body>
    </html>
  );
}
