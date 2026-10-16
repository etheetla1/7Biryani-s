"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { track } from "./Tracker";
import { dollarsFromCents } from "@/lib/money";

type Sku = {
  id: string;
  sizeId: string;
  priceCents: number;
  available: boolean;
  description: string;
  allergenNote: string;
  imageId: string;
  size: { id: string; label: string; serves: string };
};

export function DishCard({
  flavor,
}: {
  flavor: {
    id: string;
    name: string;
    available: boolean;
    skus: Sku[];
  };
}) {
  const { add } = useCart();
  const [sizeId, setSizeId] = useState("24oz");
  const sku = flavor.skus.find((s) => s.sizeId === sizeId) ?? flavor.skus[0];
  const onSale = flavor.available && sku?.available;
  const scale = sizeId === "full_tray" ? 1.08 : sizeId === "half_tray" ? 1.03 : 1;

  const vessel = useMemo(() => {
    if (sizeId === "full_tray") return "Full tray";
    if (sizeId === "half_tray") return "Half tray";
    return "24 oz bowl";
  }, [sizeId]);

  return (
    <article
      className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--night-2)]"
      onPointerEnter={() => track("item_view", { itemId: flavor.id, sizeId })}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={`/images/${sku?.imageId ?? flavor.id}-biryani.jpg`}
          alt={flavor.name}
          className="vessel h-full w-full object-cover"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="grain pointer-events-none absolute inset-0" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--saffron)]">{vessel}</p>
          <h2 className="display text-3xl">{flavor.name}</h2>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <p className="text-sm text-[var(--cream-dim)]">{sku?.description}</p>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Portion size">
          {flavor.skus.map((s) => (
            <button
              key={s.sizeId}
              type="button"
              role="radio"
              aria-checked={s.sizeId === sizeId}
              className={`min-h-11 rounded-full border px-2 text-xs ${
                s.sizeId === sizeId
                  ? "border-[var(--saffron)] bg-[var(--saffron)] text-[var(--ink)]"
                  : "border-[var(--line)] text-[var(--cream)]"
              }`}
              onClick={() => {
                setSizeId(s.sizeId);
                track("size_select", { itemId: flavor.id, sizeId: s.sizeId });
              }}
            >
              {s.size.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--cream-dim)]">Serves {sku?.size.serves}</p>
        <div className="flex items-end justify-between gap-3">
          <p className="display text-3xl text-[var(--saffron)]">
            {sku ? dollarsFromCents(sku.priceCents) : "—"}
          </p>
          {onSale ? (
            <button
              type="button"
              className="min-h-11 rounded-full bg-[var(--copper)] px-5 font-semibold text-[var(--cream)]"
              onClick={() => {
                add({ skuId: sku.id, flavorId: flavor.id, sizeId: sku.sizeId });
                track("add_to_cart", { itemId: flavor.id, sizeId: sku.sizeId });
              }}
            >
              Add
            </button>
          ) : (
            <p className="min-h-11 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--cream-dim)]">
              Sold out
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
