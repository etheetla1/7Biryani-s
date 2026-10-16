"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminNav() {
  const router = useRouter();
  return (
    <nav className="flex flex-wrap gap-3 border-b border-[var(--line)] px-4 py-3 text-sm">
      <Link className="inline-flex min-h-11 items-center" href="/admin/orders">
        Orders
      </Link>
      <Link className="inline-flex min-h-11 items-center" href="/admin/menu">
        Menu
      </Link>
      <Link className="inline-flex min-h-11 items-center" href="/admin/hours">
        Hours
      </Link>
      <Link className="inline-flex min-h-11 items-center" href="/admin/insights">
        Insights
      </Link>
      <Link className="inline-flex min-h-11 items-center" href="/admin/reviews">
        Reviews
      </Link>
      <button
        className="inline-flex min-h-11 items-center text-[var(--cream-dim)]"
        onClick={async () => {
          await fetch("/api/admin/logout", { method: "POST" });
          router.push("/admin");
        }}
      >
        Log out
      </button>
    </nav>
  );
}
