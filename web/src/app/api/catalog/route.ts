import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const { flavors, sizes, settings } = await getCatalog();
  return NextResponse.json({
    settings,
    sizes,
    flavors: flavors.map((f) => ({
      id: f.id,
      name: f.name,
      available: f.available,
      skus: f.skus.map((s) => ({
        id: s.id,
        sizeId: s.sizeId,
        priceCents: s.priceCents,
        available: s.available && f.available,
        description: s.description,
        allergenNote: s.allergenNote,
        imageId: s.imageId,
        size: s.size,
      })),
    })),
  });
}
