import Link from "next/link";

export function SiteHeader({ cartCount }: { cartCount?: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(7,5,4,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 min-w-0 items-center gap-2">
          <span className="display text-3xl leading-none text-[var(--saffron)]">7</span>
          <span className="leading-tight">
            <span className="display block text-lg text-[var(--cream)]">Biryani</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-[var(--cream-dim)] sm:block">
              Indian Food Ridgewood
            </span>
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1 text-sm">
          <Link className="inline-flex min-h-11 items-center px-2" href="/menu">
            Menu
          </Link>
          <Link className="inline-flex min-h-11 items-center px-2" href="/about">
            About
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-[var(--saffron)] px-4 font-semibold text-[var(--ink)]"
            href="/cart"
          >
            Cart{typeof cartCount === "number" && cartCount > 0 ? ` · ${cartCount}` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] px-4 py-10 text-sm text-[var(--cream-dim)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:justify-between">
        <p>Halal meat only. Pickup only. Prices before tax.</p>
        <p className="flex gap-4">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </p>
      </div>
    </footer>
  );
}
