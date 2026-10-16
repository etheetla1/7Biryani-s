"use client";

import { useState } from "react";
import type { Biryani } from "@/content/biryanis";
import { BiryaniCard } from "./BiryaniCard";
import { BiryaniDetail } from "./BiryaniDetail";
import { track } from "./Tracker";

export function BiryaniGrid({
  items,
  prices,
}: {
  items: Biryani[];
  prices: Record<string, number>;
}) {
  const [open, setOpen] = useState<Biryani | null>(null);
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <BiryaniCard
            key={b.id}
            biryani={b}
            fromCents={prices[b.flavorId]}
            onView={() => {
              track("biryani_viewed", { itemId: b.slug });
              setOpen(b);
            }}
          />
        ))}
      </div>
      {open && <BiryaniDetail biryani={open} fromCents={prices[open.flavorId]} onClose={() => setOpen(null)} />}
    </>
  );
}
