"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { track } from "./Tracker";

export function ReorderButton({ items }: { items: { skuId: string; qty: number }[] }) {
  const { add, clear } = useCart();
  const router = useRouter();
  return (
    <button
      className="mt-6 min-h-11 rounded-full bg-[var(--copper)] px-5 font-semibold"
      onClick={() => {
        track("reorder_click");
        clear();
        items.forEach((i) => {
          const [flavorId, sizeId] = i.skuId.split(":");
          add({ skuId: i.skuId, flavorId, sizeId }, i.qty);
        });
        router.push("/order");
      }}
    >
      Reorder
    </button>
  );
}
