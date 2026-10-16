"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { track } from "./Tracker";
import { dollarsFromCents, taxFromSubtotal } from "@/lib/money";
import { biryaniByFlavorId } from "@/content/biryanis";

type Catalog = {
  settings: { taxBps: number };
  flavors: {
    id: string;
    name: string;
    skus: { id: string; priceCents: number; size: { label: string } }[];
  }[];
};

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, hydrated } = useCart();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  useEffect(() => {
    if (!open) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog);
  }, [open]);

  if (!hydrated || !open) return null;

  const rows = lines.map((l) => {
    const flavor = catalog?.flavors.find((f) => f.skus.some((s) => s.id === l.skuId));
    const sku = flavor?.skus.find((s) => s.id === l.skuId);
    const editorial = biryaniByFlavorId(l.flavorId);
    return { ...l, flavor, sku, editorial };
  });
  const subtotal = rows.reduce((s, r) => s + (r.sku ? r.sku.priceCents * r.qty : 0), 0);
  const tax = taxFromSubtotal(subtotal, catalog?.settings?.taxBps ?? 6625);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35" role="dialog" aria-label="Your order">
      <button className="h-full flex-1" aria-label="Close cart" onClick={() => setOpen(false)} />
      <aside className="flex h-full w-full max-w-md flex-col bg-[var(--paper)] shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="display text-3xl">Your order</h2>
          <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">
          {rows.length === 0 && <p className="text-[var(--cream-dim)]">No biryanis yet.</p>}
          <ul className="space-y-4">
            {rows.map((r) => (
              <li key={r.skuId} className="border-b border-[var(--line)] pb-4">
                <p className="font-semibold">{r.editorial?.name ?? r.flavor?.name}</p>
                <p className="text-sm text-[var(--cream-dim)]">{r.sku?.size.label}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <input
                    aria-label="Quantity"
                    className="min-h-11 w-16 rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-2 text-center"
                    type="number"
                    min={0}
                    value={r.qty}
                    onChange={(e) => setQty(r.skuId, Number(e.target.value))}
                  />
                  <p>{r.sku ? dollarsFromCents(r.sku.priceCents * r.qty) : ""}</p>
                  <button
                    type="button"
                    className="text-sm text-[var(--danger)]"
                    onClick={() => {
                      track("remove_from_cart", { itemId: r.flavorId, sizeId: r.sizeId });
                      remove(r.skuId);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {rows.length > 0 && (
          <div className="border-t border-[var(--line)] px-5 py-5">
            <p>Subtotal {dollarsFromCents(subtotal)}</p>
            <p className="text-sm text-[var(--cream-dim)]">NJ tax {dollarsFromCents(tax)} (added at checkout)</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Pickup only. Prices before tax on the menu.</p>
            <Link
              href="/checkout"
              className="btn btn-accent mt-4 w-full"
              onClick={() => {
                track("checkout_start");
                setOpen(false);
              }}
            >
              Pickup details
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
