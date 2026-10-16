"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { track } from "./Tracker";
import { site } from "@/content/site";

const links = [
  { href: "/#the-seven", label: "The 7" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar() {
  const path = usePathname();
  const { lines, hydrated, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const n = hydrated ? lines.reduce((s, l) => s + l.qty, 0) : 0;
  const marketing = !path.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(246,240,230,0.92)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2">
          <span className="display text-2xl leading-none text-[var(--ink)] sm:text-3xl">{site.brand}</span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
            {site.subtitle}
          </span>
        </Link>
        {marketing && (
          <>
            <nav className="hidden items-center gap-1 text-sm md:flex">
              {links.map((l) => (
                <Link key={l.href} className="inline-flex min-h-11 items-center px-3" href={l.href}>
                  {l.label}
                </Link>
              ))}
              {n > 0 && (
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center px-3"
                  onClick={() => setOpen(true)}
                >
                  Cart · {n}
                </button>
              )}
              <Link
                href="/order"
                className="btn btn-accent ml-2"
                onClick={() => track("hero_order_clicked")}
              >
                Order
              </Link>
            </nav>
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/order" className="btn btn-accent px-4 text-sm">
                Order
              </Link>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--line-strong)]"
                aria-expanded={menu}
                aria-label="Open menu"
                onClick={() => setMenu((v) => !v)}
              >
                <span aria-hidden>{menu ? "×" : "☰"}</span>
              </button>
            </div>
          </>
        )}
      </div>
      {menu && marketing && (
        <div className="border-t border-[var(--line)] px-4 py-3 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                className="inline-flex min-h-11 items-center"
                href={l.href}
                onClick={() => setMenu(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link className="inline-flex min-h-11 items-center" href="/order" onClick={() => setMenu(false)}>
              Order for pickup
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
