import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { CartProvider } from "@/components/CartProvider";
import { Tracker } from "@/components/Tracker";
import { site } from "@/content/site";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const text = Figtree({ subsets: ["latin"], variable: "--font-text" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: site.seo.title,
  description: site.seo.description,
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
  openGraph: {
    title: "SEVEN",
    images: ["/images/og-7-biryani.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body className="antialiased" style={{ fontFamily: "var(--font-text), var(--text)" }}>
        <CartProvider>
          <Suspense fallback={null}>
            <Tracker />
          </Suspense>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
