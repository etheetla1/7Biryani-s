import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--ivory-2)] px-4 py-12 text-sm text-[var(--cream-dim)]">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <p className="display text-3xl text-[var(--ink)]">{site.brand}</p>
          <p className="mt-1 uppercase tracking-[0.18em] text-[var(--muted)]">{site.subtitle}</p>
          <p className="mt-4 text-[var(--ink)]">Pickup only</p>
          <p className="mt-1">{site.pickup.cityLine}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/#the-seven">
            The 7
          </Link>
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/about">
            Our Story
          </Link>
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/order">
            Order
          </Link>
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/faq">
            FAQ
          </Link>
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/review">
            Leave a Review
          </Link>
          <Link className="min-h-11 py-2 text-[var(--ink)]" href="/contact">
            Contact
          </Link>
          <Link className="min-h-11 py-2" href="/privacy">
            Privacy
          </Link>
          <Link className="min-h-11 py-2" href="/terms">
            Terms
          </Link>
        </div>
        <div>
          <p className="kicker">Social</p>
          <p className="mt-3">Instagram, TikTok, and Facebook links will appear here when accounts are published.</p>
          <p className="mt-6 text-xs">{site.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
