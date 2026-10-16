"use client";

import { useMemo, useState } from "react";
import type { Biryani } from "@/content/biryanis";
import { useCart } from "./CartProvider";
import { track } from "./Tracker";
import { dollarsFromCents } from "@/lib/money";
import { imagePath } from "@/lib/images";
import { SpiceLevel } from "./SpiceLevel";
import { DietaryBadge } from "./DietaryBadge";
import { site } from "@/content/site";

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

export function OrderDish({
  biryani,
  flavor,
  highlight,
}: {
  biryani: Biryani;
  flavor: { id: string; name: string; available: boolean; skus: Sku[] };
  highlight?: boolean;
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
      id={biryani.slug}
      className={`overflow-hidden rounded-[var(--radius)] border bg-[var(--paper)] ${
        highlight ? "border-[var(--saffron)] ring-2 ring-[var(--saffron)]" : "border-[var(--line)]"
      }`}
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--night)] md:aspect-auto">
          <img
            src={imagePath(sku?.imageId ?? biryani.flavorId)}
            alt={`${biryani.name} — ${biryani.subtitle}`}
            className="vessel h-full w-full object-cover"
            style={{ transform: `scale(${scale})` }}
          />
          <div className="grain pointer-events-none absolute inset-0" aria-hidden />
          <p className="absolute left-4 top-4 display text-4xl text-[var(--ivory)]">{biryani.number}</p>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="kicker">{vessel}</p>
              <h2 className="display text-3xl">{biryani.name}</h2>
              <p className="text-[var(--cream-dim)]">{biryani.subtitle}</p>
            </div>
            <DietaryBadge diet={biryani.diet} />
          </div>
          <p className="text-sm">{biryani.description}</p>
          <SpiceLevel level={biryani.spiceLevel} />
          <p className="text-sm text-[var(--cream-dim)]">Ingredients: {biryani.ingredients.join(", ")}</p>
          <p className="text-xs text-[var(--muted)]">{sku?.allergenNote || site.policies.allergen}</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Portion size">
            {flavor.skus.map((s) => (
              <button
                key={s.sizeId}
                type="button"
                role="radio"
                aria-checked={s.sizeId === sizeId}
                className={`min-h-11 rounded-full border px-2 text-xs ${
                  s.sizeId === sizeId
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]"
                    : "border-[var(--line-strong)]"
                }`}
                onClick={() => {
                  setSizeId(s.sizeId);
                  track("size_select", { itemId: biryani.slug, sizeId: s.sizeId });
                }}
              >
                {s.size.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--cream-dim)]">Serves {sku?.size.serves}</p>
          <div className="flex items-end justify-between gap-3">
            <p className="display text-3xl">{sku ? dollarsFromCents(sku.priceCents) : "—"}</p>
            {onSale ? (
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  add({ skuId: sku.id, flavorId: flavor.id, sizeId: sku.sizeId });
                  track("add_to_cart", { itemId: biryani.slug, sizeId: sku.sizeId });
                }}
              >
                Add to order
              </button>
            ) : (
              <p className="min-h-11 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--cream-dim)]">
                Sold out
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
