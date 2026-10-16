import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";

export default async function AdminHome() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  redirect("/admin/orders");
}
