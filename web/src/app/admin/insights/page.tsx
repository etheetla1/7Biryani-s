import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { dollarsFromCents } from "@/lib/money";

export default async function Insights() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  const [visits, adds, ordersPlaced, paid, events] = await Promise.all([
    prisma.event.count({ where: { type: "page_view" } }),
    prisma.event.count({ where: { type: "add_to_cart" } }),
    prisma.event.count({ where: { type: "order_placed" } }),
    prisma.order.findMany({ where: { paymentStatus: { in: ["paid", "test"] } }, include: { items: true, customer: true } }),
    prisma.event.groupBy({ by: ["type"], _count: { _all: true } }),
  ]);
  const revenue = paid.reduce((s, o) => s + o.totalCents, 0);
  const skuCount = new Map<string, number>();
  for (const o of paid) {
    for (const i of o.items) skuCount.set(i.skuId, (skuCount.get(i.skuId) || 0) + i.qty);
  }
  const top = [...skuCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const byPhone = new Map<string, number>();
  for (const o of paid) byPhone.set(o.customer.phoneE164, (byPhone.get(o.customer.phoneE164) || 0) + 1);
  const repeats = [...byPhone.values()].filter((n) => n >= 2).length;
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-xl space-y-3 px-4 py-6">
        <h1 className="display text-3xl">Insights</h1>
        <p>Visits {visits}</p>
        <p>Add to cart {adds}</p>
        <p>Add-to-cart rate {visits ? `${Math.round((adds / visits) * 100)}%` : "—"}</p>
        <p>Orders {paid.length} (placed events {ordersPlaced})</p>
        <p>Revenue {dollarsFromCents(revenue)}</p>
        <p>Top SKU {top ? `${top[0]} ×${top[1]}` : "—"}</p>
        <p>Repeat customers {repeats}</p>
        <ul className="text-sm text-[var(--cream-dim)]">
          {events.map((e) => (
            <li key={e.type}>
              {e.type}: {e._count._all}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
