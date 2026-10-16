import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { HoursForm } from "@/components/HoursForm";
import { formatMin } from "@/lib/pickup";

export default async function AdminHours() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  const [hours, settings, closures] = await Promise.all([
    prisma.weeklyHour.findMany({ orderBy: { weekday: "asc" } }),
    prisma.setting.findUnique({ where: { id: "default" } }),
    prisma.closureDate.findMany(),
  ]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const initial = hours.map((h) => ({
    weekday: h.weekday,
    label: days[h.weekday],
    open: h.openMin == null ? "" : formatMin(h.openMin),
    close: h.closeMin == null ? "" : formatMin(h.closeMin),
    openValue:
      h.openMin == null
        ? ""
        : `${String(Math.floor(h.openMin / 60)).padStart(2, "0")}:${String(h.openMin % 60).padStart(2, "0")}`,
    closeValue:
      h.closeMin == null
        ? ""
        : `${String(Math.floor(h.closeMin / 60)).padStart(2, "0")}:${String(h.closeMin % 60).padStart(2, "0")}`,
  }));
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-xl px-4 py-6">
        <h1 className="display text-3xl">Hours</h1>
        <HoursForm initial={initial} trayHour={settings?.trayOrderByHour ?? 17} closures={closures} />
      </div>
    </div>
  );
}
