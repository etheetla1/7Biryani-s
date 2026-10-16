"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function HoursForm({
  initial,
  trayHour,
  closures,
}: {
  initial: { weekday: number; label: string; openValue: string; closeValue: string }[];
  trayHour: number;
  closures: { date: string; reason: string | null }[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [tray, setTray] = useState(trayHour);
  const [closed, setClosed] = useState(closures.map((c) => c.date).join("\n"));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trayOrderByHour: tray,
        hours: rows.map((r) => ({
          weekday: r.weekday,
          open: r.openValue || null,
          close: r.closeValue || null,
        })),
        closures: closed
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((date) => ({ date })),
      }),
    });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {rows.map((r, i) => (
        <div key={r.weekday} className="grid grid-cols-[4rem_1fr_1fr] items-center gap-2">
          <span>{r.label}</span>
          <input
            type="time"
            className="min-h-11 rounded-lg bg-black/40 px-2"
            value={r.openValue}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...r, openValue: e.target.value };
              setRows(next);
            }}
          />
          <input
            type="time"
            className="min-h-11 rounded-lg bg-black/40 px-2"
            value={r.closeValue}
            onChange={(e) => {
              const next = [...rows];
              next[i] = { ...r, closeValue: e.target.value };
              setRows(next);
            }}
          />
        </div>
      ))}
      <label className="block">
        Tray order-by hour (24h, Eastern)
        <input
          type="number"
          min={0}
          max={23}
          className="mt-1 min-h-11 w-full rounded-lg bg-black/40 px-3"
          value={tray}
          onChange={(e) => setTray(Number(e.target.value))}
        />
      </label>
      <label className="block">
        Closure dates (YYYY-MM-DD, one per line)
        <textarea className="mt-1 min-h-24 w-full rounded-lg bg-black/40 px-3 py-2" value={closed} onChange={(e) => setClosed(e.target.value)} />
      </label>
      <button className="min-h-11 w-full rounded-full bg-[var(--saffron)] font-semibold text-[var(--ink)]">Save</button>
    </form>
  );
}
