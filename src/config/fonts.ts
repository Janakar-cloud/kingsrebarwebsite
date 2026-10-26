import { Archivo, Geist, Geist_Mono } from "next/font/google";

/** Display face. Weight and width axes keep headings smooth at every size. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

/** Used only for small technical labels, so it is not preloaded. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Consolas", "monospace"],
  adjustFontFallback: true,
});

export const fontVariables = [archivo.variable, geist.variable, geistMono.variable].join(" ");
