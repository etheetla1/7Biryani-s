import { prisma } from "./db";

export async function getCatalog() {
  const [flavors, sizes, settings] = await Promise.all([
    prisma.flavor.findMany({
      orderBy: { sortOrder: "asc" },
      include: { skus: { include: { size: true }, orderBy: { sortOrder: "asc" } } },
    }),
    prisma.size.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.setting.findUnique({ where: { id: "default" } }),
  ]);
  return { flavors, sizes, settings };
}

export function isSkuOnSale(flavorAvailable: boolean, skuAvailable: boolean) {
  return flavorAvailable && skuAvailable;
}
