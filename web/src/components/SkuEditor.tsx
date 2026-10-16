"use client";

import { useRouter } from "next/navigation";
import { dollarsFromCents } from "@/lib/money";

export function SkuEditor({
  sku,
}: {
  sku: {
    id: string;
    flavorId: string;
    sizeId: string;
    priceCents: number;
    available: boolean;
    description: string;
    size: { label: string };
    flavor: { name: string; available: boolean };
  };
}) {
  const router = useRouter();
  async function save(data: Record<string, unknown>) {
    await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skuId: sku.id, ...data }),
    });
    router.refresh();
  }
  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] p-4">
      <p className="font-semibold">
        {sku.flavor.name} · {sku.size.label}
      </p>
      <p className="text-sm text-[var(--cream-dim)]">{dollarsFromCents(sku.priceCents)}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="min-h-11 rounded-full border border-[var(--line)] px-4" onClick={() => save({ available: !sku.available })}>
          {sku.available ? "Mark sold out" : "Make available"}
        </button>
        <button
          className="min-h-11 rounded-full border border-[var(--line)] px-4"
          onClick={() => save({ flavorId: sku.flavorId, flavorAvailable: !sku.flavor.available })}
        >
          {sku.flavor.available ? "Hide flavor" : "Show flavor"}
        </button>
        <button
          className="min-h-11 rounded-full border border-[var(--line)] px-4"
          onClick={() => {
            const dollars = prompt("New price in dollars", String(sku.priceCents / 100));
            if (!dollars) return;
            save({ priceCents: Math.round(Number(dollars) * 100) });
          }}
        >
          Edit price
        </button>
        <button
          className="min-h-11 rounded-full border border-[var(--line)] px-4"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.set("file", file);
              fd.set("imageId", sku.flavorId);
              await fetch("/api/admin/image", { method: "POST", body: fd });
              router.refresh();
            };
            input.click();
          }}
        >
          Replace image
        </button>
        <button
          className="min-h-11 rounded-full border border-[var(--line)] px-4"
          onClick={() => {
            const description = prompt("Description", sku.description);
            if (description == null) return;
            save({ description });
          }}
        >
          Edit copy
        </button>
      </div>
    </div>
  );
}
