import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { recordEvent } from "@/lib/events";

const Body = z.object({
  type: z.enum([
    "page_view",
    "item_view",
    "size_select",
    "add_to_cart",
    "remove_from_cart",
    "checkout_start",
    "order_placed",
    "reorder_click",
    "hero_order_clicked",
    "biryani_viewed",
    "biryani_selected",
    "quiz_started",
    "quiz_completed",
    "pickup_time_selected",
    "review_started",
    "review_submitted",
    "faq_opened",
  ]),
  itemId: z.string().optional().nullable(),
  sizeId: z.string().optional().nullable(),
  path: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const vid = (await cookies()).get("ifrw_vid")?.value;
  if (!vid) return NextResponse.json({ ok: true });
  await recordEvent({ visitorId: vid, ...parsed.data });
  return NextResponse.json({ ok: true });
}
