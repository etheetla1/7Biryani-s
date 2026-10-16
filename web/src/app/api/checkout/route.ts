import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { taxFromSubtotal, toE164Us, dollarsFromCents } from "@/lib/money";
import { nyDateTimeToUtc } from "@/lib/pickup";
import { recordEvent } from "@/lib/events";
import { orderEmails } from "@/lib/email";

const Body = z.object({
  name: z.string().min(1).max(80),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().or(z.literal("")),
  note: z.string().max(500).optional(),
  pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickupMin: z.number().int().min(0).max(24 * 60),
  lines: z.array(z.object({ skuId: z.string(), qty: z.number().int().min(1).max(20) })).min(1),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid checkout" }, { status: 400 });
  let phone: string;
  try {
    phone = toE164Us(parsed.data.phone);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Phone" }, { status: 400 });
  }
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });
  if (!settings) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const skuIds = parsed.data.lines.map((l) => l.skuId);
  const skus = await prisma.sku.findMany({
    where: { id: { in: skuIds } },
    include: { flavor: true, size: true },
  });
  if (skus.length !== skuIds.length) return NextResponse.json({ error: "Unknown item" }, { status: 400 });

  let subtotal = 0;
  let items: {
    skuId: string;
    flavorName: string;
    sizeLabel: string;
    qty: number;
    unitPriceCents: number;
  }[];
  try {
    items = parsed.data.lines.map((line) => {
      const sku = skus.find((s) => s.id === line.skuId);
      if (!sku) throw new Error("SOLD_OUT");
      if (!sku.available || !sku.flavor.available) throw new Error("SOLD_OUT");
      subtotal += sku.priceCents * line.qty;
      return {
        skuId: sku.id,
        flavorName: sku.flavor.name,
        sizeLabel: sku.size.label,
        qty: line.qty,
        unitPriceCents: sku.priceCents,
      };
    });
  } catch {
    return NextResponse.json({ error: "An item is sold out" }, { status: 409 });
  }

  const tax = taxFromSubtotal(subtotal, settings.taxBps);
  const total = subtotal + tax;
  const pickupAt = nyDateTimeToUtc(parsed.data.pickupDate, parsed.data.pickupMin, settings.timezone);

  const customer = await prisma.customer.upsert({
    where: { phoneE164: phone },
    update: { name: parsed.data.name, email: parsed.data.email || undefined },
    create: { phoneE164: phone, name: parsed.data.name, email: parsed.data.email || null },
  });

  const jar = await cookies();
  let visitorId = jar.get("ifrw_vid")?.value ?? null;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    jar.set("ifrw_vid", visitorId, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      visitorId,
      status: "received",
      paymentStatus: process.env.STRIPE_SECRET_KEY ? "pending" : "test",
      subtotalCents: subtotal,
      taxCents: tax,
      totalCents: total,
      pickupAt,
      note: parsed.data.note || null,
      items: { create: items },
    },
  });

  await recordEvent({ visitorId, type: "order_placed", path: "/checkout" });

  const linesText = items.map((i) => `${i.qty}× ${i.flavorName} ${i.sizeLabel}`).join("\n");
  await orderEmails({
    customerEmail: parsed.data.email || null,
    customerName: parsed.data.name,
    kitchenEmail: settings.kitchenEmail || process.env.KITCHEN_EMAIL || null,
    orderId: order.id,
    pickup: pickupAt.toLocaleString("en-US", { timeZone: settings.timezone }),
    lines: linesText,
    total: dollarsFromCents(total),
  });

  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/orders/${order.id}?paid=1`,
      cancel_url: `${origin}/checkout`,
      metadata: { orderId: order.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: total,
            product_data: { name: `7 Biryani pickup ${order.id.slice(0, 8)}` },
          },
        },
      ],
    });
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });
    return NextResponse.json({ url: session.url, orderId: order.id });
  }

  return NextResponse.json({ url: `/orders/${order.id}`, orderId: order.id });
}
