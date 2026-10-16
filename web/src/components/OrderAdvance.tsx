"use client";

import { useRouter } from "next/navigation";

const NEXT: Record<string, string | null> = {
  received: "accepted",
  accepted: "ready",
  ready: "completed",
  completed: null,
  cancelled: null,
};

export function OrderAdvance({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const next = NEXT[status];
  async function go(status: string) {
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, status }),
    });
    router.refresh();
  }
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {next && (
        <button className="min-h-11 rounded-full bg-[var(--saffron)] px-4 font-semibold text-[var(--ink)]" onClick={() => go(next)}>
          Mark {next}
        </button>
      )}
      {status !== "cancelled" && status !== "completed" && (
        <button className="min-h-11 rounded-full border border-[var(--line)] px-4" onClick={() => go("cancelled")}>
          Cancel
        </button>
      )}
    </div>
  );
}
