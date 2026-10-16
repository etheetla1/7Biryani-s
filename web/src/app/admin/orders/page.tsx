import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { dollarsFromCents } from "@/lib/money";
import { AdminNav } from "@/components/AdminNav";
import { OrderAdvance } from "@/components/OrderAdvance";

export default async function AdminOrders() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, customer: true },
    take: 80,
  });
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <h1 className="display text-3xl">Orders</h1>
        {orders.length === 0 && <p className="text-[var(--cream-dim)]">No orders yet.</p>}
        {orders.map((o) => (
          <article key={o.id} className="rounded-[var(--radius)] border border-[var(--line)] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--saffron)]">
              {o.status} · {o.paymentStatus}
            </p>
            <p className="text-lg font-semibold">{o.customer.name}</p>
            <p className="text-sm text-[var(--cream-dim)]">{o.customer.phoneE164}</p>
            <p className="text-sm">Pickup {o.pickupAt.toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
            <ul className="mt-2 text-sm">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.qty}× {i.flavorName} {i.sizeLabel}
                </li>
              ))}
            </ul>
            <p className="mt-2">{dollarsFromCents(o.totalCents)}</p>
            <OrderAdvance id={o.id} status={o.status} />
          </article>
        ))}
      </div>
    </div>
  );
}
