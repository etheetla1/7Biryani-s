import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminNav } from "@/components/AdminNav";
import { ReviewModerate } from "@/components/ReviewModerate";
import { biryanis } from "@/content/biryanis";

export default async function AdminReviews() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin");
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 80 });
  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <h1 className="display text-3xl">Reviews</h1>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => {
          const b = biryanis.find((x) => x.id === r.biryaniId);
          return (
            <article key={r.id} className="rounded-[var(--radius)] border border-[var(--line)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--saffron)]">{r.status}</p>
              <p className="font-semibold">
                {r.firstName} {r.lastName ?? ""} · {r.rating}/5
              </p>
              <p className="text-sm">{b ? `${b.number} ${b.name}` : r.biryaniId}</p>
              <p className="mt-2">{r.body}</p>
              {r.photoUrl && <img src={r.photoUrl} alt="" className="mt-3 max-h-40 rounded object-cover" />}
              <p className="mt-2 text-xs opacity-70">{r.email}</p>
              <ReviewModerate id={r.id} status={r.status} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
