"use client";

import { useRouter } from "next/navigation";

export function ReviewModerate({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  async function go(next: string) {
    await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    router.refresh();
  }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {status !== "approved" && (
        <button className="min-h-11 rounded-full bg-[var(--saffron)] px-4 font-semibold text-[var(--ink)]" onClick={() => go("approved")}>
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button className="min-h-11 rounded-full border border-[var(--line)] px-4" onClick={() => go("rejected")}>
          Reject
        </button>
      )}
    </div>
  );
}
