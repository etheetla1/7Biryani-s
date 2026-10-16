import type { Biryani } from "@/content/biryanis";
import { imagePath } from "@/lib/images";
import { SpiceLevel } from "./SpiceLevel";
import { DietaryBadge } from "./DietaryBadge";
import Link from "next/link";
import { dollarsFromCents } from "@/lib/money";

export function BiryaniCard({
  biryani,
  fromCents,
  onView,
}: {
  biryani: Biryani;
  fromCents?: number;
  onView?: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--night)]">
        <img
          src={imagePath(biryani.flavorId)}
          alt={`${biryani.name} — ${biryani.subtitle}`}
          className="h-full w-full object-cover"
        />
        <p className="absolute left-4 top-4 display text-3xl text-[var(--ivory)]">{biryani.number}</p>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display text-2xl">{biryani.name}</h3>
            <p className="text-sm text-[var(--cream-dim)]">{biryani.subtitle}</p>
          </div>
          <DietaryBadge diet={biryani.diet} />
        </div>
        <p className="text-sm text-[var(--cream-dim)]">{biryani.shortDescription}</p>
        <SpiceLevel level={biryani.spiceLevel} />
        {typeof fromCents === "number" && (
          <p className="text-sm">From {dollarsFromCents(fromCents)}</p>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <button type="button" className="btn btn-ghost" onClick={onView}>
            View biryani
          </button>
          <Link href={`/order?biryani=${biryani.slug}`} className="btn btn-primary">
            Order
          </Link>
        </div>
      </div>
    </article>
  );
}
