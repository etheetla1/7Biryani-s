"use client";

import Link from "next/link";
import type { Biryani } from "@/content/biryanis";
import { imagePath } from "@/lib/images";
import { SpiceLevel } from "./SpiceLevel";
import { DietaryBadge } from "./DietaryBadge";
import { dollarsFromCents } from "@/lib/money";
import { site } from "@/content/site";

export function BiryaniDetail({
  biryani,
  fromCents,
  onClose,
}: {
  biryani: Biryani;
  fromCents?: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6" role="dialog" aria-modal>
      <div className="max-h-[92vh] w-full max-w-xl overflow-auto rounded-t-[var(--radius)] bg-[var(--paper)] sm:rounded-[var(--radius)]">
        <img src={imagePath(biryani.flavorId)} alt="" className="h-56 w-full object-cover" />
        <div className="space-y-4 p-6">
          <p className="kicker">{biryani.number}</p>
          <div className="flex items-start justify-between gap-3">
            <h2 className="display text-4xl">{biryani.name}</h2>
            <DietaryBadge diet={biryani.diet} />
          </div>
          <p className="text-[var(--cream-dim)]">{biryani.subtitle}</p>
          <SpiceLevel level={biryani.spiceLevel} />
          <p>{biryani.description}</p>
          <p className="text-sm text-[var(--cream-dim)]">Ingredients: {biryani.ingredients.join(", ")}</p>
          <p className="text-sm text-[var(--cream-dim)]">{biryani.allergens.join(" · ")}</p>
          <p className="text-sm">{site.policies.allergen}</p>
          {typeof fromCents === "number" && <p>From {dollarsFromCents(fromCents)} · 24 oz</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <Link href={`/order?biryani=${biryani.slug}`} className="btn btn-primary">
              Order this biryani
            </Link>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
