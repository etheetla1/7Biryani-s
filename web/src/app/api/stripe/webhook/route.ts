import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const wh = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !wh) return NextResponse.json({ received: true });
  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  if (!sig) return NextResponse.json({ error: "no sig" }, { status: 400 });
  const event = stripe.webhooks.constructEvent(raw, sig, wh);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "paid" },
      });
    }
  }
  return NextResponse.json({ received: true });
}
