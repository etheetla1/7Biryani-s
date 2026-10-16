import { redirect } from "next/navigation";
import { biryaniBySlug } from "@/content/biryanis";

export default async function LegacyOrderStatus({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (biryaniBySlug(id)) redirect(`/order?biryani=${id}`);
  redirect(`/orders/${id}`);
}
