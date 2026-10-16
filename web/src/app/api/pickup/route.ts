import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { earliestPickupDate, pickupSlotsOnDate, formatMin, addDays } from "@/lib/pickup";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const sizeId = new URL(req.url).searchParams.get("sizeId") || "24oz";
  const [hours, closures, settings] = await Promise.all([
    prisma.weeklyHour.findMany(),
    prisma.closureDate.findMany(),
    prisma.setting.findUnique({ where: { id: "default" } }),
  ]);
  const closed = new Set(closures.map((c) => c.date));
  const start = earliestPickupDate({
    sizeId,
    hours,
    closures: closed,
    trayOrderByHour: settings?.trayOrderByHour ?? 17,
    trayLeadDays: settings?.trayLeadDays ?? 1,
    cutoffMinutes: settings?.pickupCutoffMinutes ?? 45,
  });
  if (!start) return NextResponse.json({ dates: [] });
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const dateStr = addDays(start, i);
    const slots = pickupSlotsOnDate({
      dateStr,
      hours,
      closures: closed,
      cutoffMinutes: settings?.pickupCutoffMinutes ?? 45,
      sizeId,
    });
    if (slots.length) dates.push({ dateStr, slots: slots.map((m) => ({ min: m, label: formatMin(m) })) });
  }
  return NextResponse.json({ dates, fulfillment: settings?.fulfillment });
}
