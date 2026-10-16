"use client";

import { SiteHeader, SiteFooter } from "./Chrome";
import { useCart } from "./CartProvider";

export function StoreShell({ children }: { children: React.ReactNode }) {
  const { lines, hydrated } = useCart();
  const n = hydrated ? lines.reduce((s, l) => s + l.qty, 0) : undefined;
  return (
    <div className="min-h-screen">
      <SiteHeader cartCount={n} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
