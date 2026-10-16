import { prisma } from "./db";

export async function visitorIdFrom(cookieHeader: string | null) {
  const match = cookieHeader?.match(/(?:^|; )ifrw_vid=([^;]+)/);
  return match?.[1] ?? null;
}

export async function recordEvent(input: {
  visitorId: string;
  type: string;
  itemId?: string | null;
  sizeId?: string | null;
  path?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}) {
  await prisma.event.create({
    data: {
      visitorId: input.visitorId,
      type: input.type,
      itemId: input.itemId ?? null,
      sizeId: input.sizeId ?? null,
      path: input.path ?? null,
      referrer: input.referrer ?? null,
      utmSource: input.utmSource ?? null,
      utmMedium: input.utmMedium ?? null,
      utmCampaign: input.utmCampaign ?? null,
    },
  });
}
