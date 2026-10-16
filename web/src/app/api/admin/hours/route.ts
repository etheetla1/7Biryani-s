import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  hours: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      open: z.string().nullable(),
      close: z.string().nullable(),
    }),
  ),
  trayOrderByHour: z.number().int().min(0).max(23).optional(),
  closures: z.array(z.object({ date: z.string(), reason: z.string().optional() })).optional(),
});

function parseHm(s: string | null) {
  if (!s) return null;
  const [h, m] = s.split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

export async function POST(req: Request) {
  const actor = await getAdminEmail();
  if (!actor) return NextResponse.json({ error: "auth" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  for (const h of parsed.data.hours) {
    await prisma.weeklyHour.upsert({
      where: { weekday: h.weekday },
      update: { openMin: parseHm(h.open), closeMin: parseHm(h.close) },
      create: {
        id: `wd-${h.weekday}`,
        weekday: h.weekday,
        openMin: parseHm(h.open),
        closeMin: parseHm(h.close),
      },
    });
  }
  if (typeof parsed.data.trayOrderByHour === "number") {
    await prisma.setting.update({
      where: { id: "default" },
      data: { trayOrderByHour: parsed.data.trayOrderByHour },
    });
  }
  if (parsed.data.closures) {
    await prisma.closureDate.deleteMany();
    for (const c of parsed.data.closures) {
      await prisma.closureDate.create({ data: { date: c.date, reason: c.reason } });
    }
  }
  return NextResponse.json({ ok: true });
}
