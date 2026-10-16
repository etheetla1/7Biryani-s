import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog";
import { BrandShell } from "@/components/BrandShell";
import { OrderCatalog } from "@/components/OrderCatalog";

export const metadata = {
  title: "Order | SEVEN",
  description: "Seven biryanis. Pickup only. Choose your bowl and schedule pickup.",
};

export default async function OrderPage() {
  const { flavors } = await getCatalog();
  return (
    <BrandShell>
      <Suspense fallback={<p className="px-4 py-20">Loading the seven…</p>}>
        <OrderCatalog
          initial={{
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
          }}
        />
      </Suspense>
    </BrandShell>
  );
}
