import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  orderId: z.string(),
  status: z.enum(["received", "accepted", "ready", "completed", "cancelled"]),
});

export async function POST(req: Request) {
  const actor = await getAdminEmail();
  if (!actor) return NextResponse.json({ error: "auth" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  await prisma.order.update({ where: { id: parsed.data.orderId }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
