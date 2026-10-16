"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrandShell } from "@/components/BrandShell";
import { useCart } from "@/components/CartProvider";
import { dollarsFromCents } from "@/lib/money";
import { track } from "@/components/Tracker";

type Catalog = {
  flavors: {
    id: string;
    name: string;
    skus: { id: string; sizeId: string; priceCents: number; available: boolean; size: { label: string } }[];
  }[];
};

export default function CartPage() {
  const { lines, setQty, hydrated } = useCart();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog);
  }, []);

  const rows = lines.map((l) => {
    const flavor = catalog?.flavors.find((f) => f.skus.some((s) => s.id === l.skuId));
    const sku = flavor?.skus.find((s) => s.id === l.skuId);
    return { ...l, flavor, sku };
  });
  const subtotal = rows.reduce((s, r) => s + (r.sku ? r.sku.priceCents * r.qty : 0), 0);

  return (
    <BrandShell>
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="display text-4xl">Cart</h1>
        {!hydrated && <p className="mt-6 text-[var(--cream-dim)]">Loading cart…</p>}
        {hydrated && rows.length === 0 && <p className="mt-6 text-[var(--cream-dim)]">Your cart is empty.</p>}
        {hydrated && (
          <>
            <ul className="mt-6 space-y-4">
              {rows.map((r) => (
                <li key={r.skuId} className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
                  <div>
                    <p className="font-semibold">{r.flavor?.name}</p>
                    <p className="text-sm text-[var(--cream-dim)]">{r.sku?.size.label}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      aria-label="Quantity"
                      className="min-h-11 w-16 rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-2 text-center"
                      type="number"
                      min={0}
                      value={r.qty}
                      onChange={(e) => setQty(r.skuId, Number(e.target.value))}
                    />
                    <p>{r.sku ? dollarsFromCents(r.sku.priceCents * r.qty) : ""}</p>
                  </div>
                </li>
              ))}
            </ul>
            {rows.length > 0 && (
              <div className="mt-8">
                <p className="text-[var(--cream-dim)]">Subtotal before tax {dollarsFromCents(subtotal)}</p>
                <Link
                  href="/checkout"
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--saffron)] px-6 font-semibold text-[var(--ink)]"
                  onClick={() => track("checkout_start")}
                >
                  Checkout
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </BrandShell>
  );
}
