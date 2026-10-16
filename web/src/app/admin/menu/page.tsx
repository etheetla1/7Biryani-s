import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { SkuEditor } from "@/components/SkuEditor";

export default async function AdminMenu() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  const skus = await prisma.sku.findMany({
    include: { flavor: true, size: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
        <h1 className="display text-3xl">Menu</h1>
        {skus.map((s) => (
          <SkuEditor key={s.id} sku={s} />
        ))}
      </div>
    </div>
  );
}
