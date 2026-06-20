import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Mark } from "@/components/brand";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: {
    default: "Clawd — a desk companion",
    template: "%s — Clawd",
  },
  description:
    "A blocky crab on an ESP32-C3 that mirrors your Claude Code sessions on a tiny 240×240 screen. Documentation and the build journey.",
  openGraph: {
    title: "Clawd — a desk companion",
    description:
      "A crab that focuses while you code, taps when it needs you, and celebrates when you're done.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:bg-ink focus:text-paper focus:px-3 focus:py-2 focus:rounded-md focus:text-sm"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Mark />
              <span className="font-serif text-xl font-semibold tracking-tight">
                Clawd
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <SiteNav />
              <span className="hidden md:block text-[10px] tracking-[0.22em] text-mut uppercase">
                A desk companion
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 w-full">
          {children}
        </main>

        <footer className="border-t border-line mt-24">
          <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center gap-3 justify-between text-[11px] tracking-[0.12em] text-mut uppercase">
            <span className="flex items-center gap-2">
              <Mark size={14} /> Clawd · a desk companion
            </span>
            <span>ESP32-C3 · ST7789 240×240 · built with Claude Code</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
