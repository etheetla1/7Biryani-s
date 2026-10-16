import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  skuId: z.string(),
  priceCents: z.number().int().positive().optional(),
  available: z.boolean().optional(),
  description: z.string().max(400).optional(),
  flavorAvailable: z.boolean().optional(),
  flavorId: z.string().optional(),
});

export async function POST(req: Request) {
  const actor = await getAdminEmail();
  if (!actor) return NextResponse.json({ error: "auth" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (parsed.data.flavorId && typeof parsed.data.flavorAvailable === "boolean") {
    await prisma.flavor.update({
      where: { id: parsed.data.flavorId },
      data: { available: parsed.data.flavorAvailable },
    });
  }
  const sku = await prisma.sku.findUnique({ where: { id: parsed.data.skuId } });
  if (!sku) return NextResponse.json({ error: "sku" }, { status: 404 });
  if (typeof parsed.data.priceCents === "number" && parsed.data.priceCents !== sku.priceCents) {
    await prisma.priceAudit.create({
      data: { actor, skuId: sku.id, oldCents: sku.priceCents, newCents: parsed.data.priceCents },
    });
  }
  await prisma.sku.update({
    where: { id: sku.id },
    data: {
      priceCents: parsed.data.priceCents ?? sku.priceCents,
      available: parsed.data.available ?? sku.available,
      description: parsed.data.description ?? sku.description,
    },
  });
  return NextResponse.json({ ok: true });
}
