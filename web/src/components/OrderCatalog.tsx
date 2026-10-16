"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { biryanis } from "@/content/biryanis";
import { OrderDish } from "./OrderDish";
import { useCart } from "./CartProvider";
import { dollarsFromCents } from "@/lib/money";
import { site } from "@/content/site";

type Catalog = {
  flavors: {
    id: string;
    name: string;
    available: boolean;
    skus: {
      id: string;
      sizeId: string;
      priceCents: number;
      available: boolean;
      description: string;
      allergenNote: string;
      imageId: string;
      size: { id: string; label: string; serves: string };
    }[];
  }[];
};

export function OrderCatalog({ initial }: { initial: Catalog }) {
  const sp = useSearchParams();
  const focus = sp.get("biryani");
  const { lines, setOpen, hydrated } = useCart();
  const [filter, setFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [catalog, setCatalog] = useState(initial);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog);
  }, []);

  useEffect(() => {
    if (!focus) return;
    document.getElementById(focus)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus]);

  const list = useMemo(
    () => biryanis.filter((b) => (filter === "all" ? true : b.diet === filter)),
    [filter],
  );
  const count = hydrated ? lines.reduce((s, l) => s + l.qty, 0) : 0;
  const subtotal = useMemo(() => {
    return lines.reduce((sum, l) => {
      const flavor = catalog.flavors.find((f) => f.skus.some((s) => s.id === l.skuId));
      const sku = flavor?.skus.find((s) => s.id === l.skuId);
      return sum + (sku ? sku.priceCents * l.qty : 0);
    }, 0);
  }, [lines, catalog]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="kicker">Pickup only</p>
      <h1 className="display mt-2 text-5xl sm:text-6xl">Choose your biryani</h1>
      <p className="mt-3 max-w-xl text-[var(--cream-dim)]">Seven choices. Pickup only. {site.pickup.body}</p>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter">
        {(["all", "veg", "non-veg"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`btn ${filter === f ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All seven" : f === "veg" ? "Vegetarian" : "Non-veg"}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-8">
        {list.map((b) => {
          const flavor = catalog.flavors.find((f) => f.id === b.flavorId);
          if (!flavor) return null;
          return <OrderDish key={b.id} biryani={b} flavor={flavor} highlight={focus === b.slug} />;
        })}
      </div>
      {count > 0 && (
        <button
          type="button"
          className="btn btn-accent fixed bottom-4 left-4 right-4 z-30 shadow-[var(--shadow)] md:left-auto md:right-6 md:w-auto"
          onClick={() => setOpen(true)}
        >
          View order · {dollarsFromCents(subtotal)}
        </button>
      )}
    </div>
  );
}
