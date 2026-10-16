import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

type MenuJson = {
  flavors: { id: string; name: string; prices: Record<string, number> }[];
};

const ALLERGEN =
  "We do not prepare allergen-friendly dishes. We are not responsible for food allergies.";

const DESCRIPTIONS: Record<string, string> = {
  chicken: "Basmati, saffron, and chicken with house spice.",
  paneer: "Basmati, saffron, and grilled paneer with house spice.",
  veg: "Basmati, saffron, and vegetables with house spice.",
  goat: "Basmati, saffron, and goat with house spice.",
  shrimp: "Basmati, saffron, and shrimp with house spice.",
  beef: "Basmati, saffron, and beef with house spice.",
  lamb: "Basmati, saffron, and lamb with house spice.",
};

async function main() {
  const menuPath = path.resolve(__dirname, "../../inventory/indianfoodridgewood/menu.json");
  const menu = JSON.parse(fs.readFileSync(menuPath, "utf8")) as MenuJson;

  await prisma.setting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      brandName: "7 Biryani",
      legalName: "Indian Food Ridgewood LLC",
      addressLine1: "16-18 S Broad St",
      city: "Ridgewood",
      state: "NJ",
      zip: "07450",
      taxBps: 6625,
      trayOrderByHour: 17,
      trayLeadDays: 1,
      pickupCutoffMinutes: 45,
      fulfillment: "pickup_only",
    },
  });

  const sizes = [
    { id: "24oz", label: "24 oz", serves: "1 person", sortOrder: 0 },
    { id: "half_tray", label: "Half tray", serves: "7–9 people", sortOrder: 1 },
    { id: "full_tray", label: "Full tray", serves: "19–24 people", sortOrder: 2 },
  ];
  for (const s of sizes) {
    await prisma.size.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // Owner hours (admin can edit). Sun–Thu 12–9:30, Fri–Sat 12–10.
  const week: { weekday: number; openMin: number; closeMin: number }[] = [
    { weekday: 0, openMin: 12 * 60, closeMin: 21 * 60 + 30 },
    { weekday: 1, openMin: 12 * 60, closeMin: 21 * 60 + 30 },
    { weekday: 2, openMin: 12 * 60, closeMin: 21 * 60 + 30 },
    { weekday: 3, openMin: 12 * 60, closeMin: 21 * 60 + 30 },
    { weekday: 4, openMin: 12 * 60, closeMin: 21 * 60 + 30 },
    { weekday: 5, openMin: 12 * 60, closeMin: 22 * 60 },
    { weekday: 6, openMin: 12 * 60, closeMin: 22 * 60 },
  ];
  for (const h of week) {
    await prisma.weeklyHour.upsert({
      where: { weekday: h.weekday },
      // Keep admin hour edits; only fill a missing weekday.
      update: {},
      create: { id: `wd-${h.weekday}`, ...h },
    });
  }

  let flavorSort = 0;
  for (const f of menu.flavors) {
    await prisma.flavor.upsert({
      where: { id: f.id },
      update: { name: f.name, sortOrder: flavorSort },
      create: { id: f.id, name: f.name, sortOrder: flavorSort, available: true },
    });
    let sizeSort = 0;
    for (const [sizeId, dollars] of Object.entries(f.prices)) {
      const skuId = `${f.id}:${sizeId}`;
      const priceCents = Math.round(Number(dollars) * 100);
      await prisma.sku.upsert({
        where: { id: skuId },
        // Keep admin price / sold-out edits; flyer prices apply only to new SKUs.
        update: {
          description: DESCRIPTIONS[f.id] ?? "",
          sortOrder: flavorSort * 10 + sizeSort,
        },
        create: {
          id: skuId,
          flavorId: f.id,
          sizeId,
          priceCents,
          available: true,
          sortOrder: flavorSort * 10 + sizeSort,
          description: DESCRIPTIONS[f.id] ?? "",
          allergenNote: ALLERGEN,
          imageId: f.id,
        },
      });
      sizeSort += 1;
    }
    flavorSort += 1;
  }

  const email = process.env.ADMIN_EMAIL || "owner@indianfoodridgewood.com";
  const password = process.env.ADMIN_PASSWORD || "changeme";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log("Seeded catalog, hours, admin", email);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
