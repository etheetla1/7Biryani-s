import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { dollarsFromCents } from "@/lib/money";
import { BrandShell } from "@/components/BrandShell";
import { ReorderButton } from "@/components/ReorderButton";

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
  if (!order) notFound();
  return (
    <BrandShell>
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="kicker">{order.status}</p>
        <h1 className="display mt-2 text-4xl">Order {order.id.slice(0, 8)}</h1>
        <p className="mt-2 text-[var(--cream-dim)]">
          Pickup {order.pickupAt.toLocaleString("en-US", { timeZone: "America/New_York" })}
        </p>
        <p className="mt-2 text-sm">Pickup only</p>
        <ul className="mt-6 space-y-2">
          {order.items.map((i) => (
            <li key={i.id}>
              {i.qty}× {i.flavorName} · {i.sizeLabel} · {dollarsFromCents(i.unitPriceCents * i.qty)}
            </li>
          ))}
        </ul>
        <p className="mt-4">Total {dollarsFromCents(order.totalCents)} (incl. tax)</p>
        <p className="text-sm text-[var(--cream-dim)]">Payment: {order.paymentStatus}</p>
        <ReorderButton items={order.items.map((i) => ({ skuId: i.skuId, qty: i.qty }))} />
        <Link className="mt-6 inline-block min-h-11 text-[var(--saffron-dim)]" href="/order">
          Back to the seven
        </Link>
      </div>
    </BrandShell>
  );
}
