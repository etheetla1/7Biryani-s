"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandShell } from "@/components/BrandShell";
import { useCart } from "@/components/CartProvider";
import { dollarsFromCents, taxFromSubtotal } from "@/lib/money";
import { track } from "@/components/Tracker";

type Pickup = { dates: { dateStr: string; slots: { min: number; label: string }[] }[] };

export default function CheckoutPage() {
  const { lines, clear, hydrated } = useCart();
  const router = useRouter();
  const [catalog, setCatalog] = useState<any>(null);
  const [pickup, setPickup] = useState<Pickup>({ dates: [] });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [min, setMin] = useState<number | "">("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const leadSize = useMemo(() => {
    if (lines.some((l) => l.sizeId === "full_tray" || l.sizeId === "half_tray")) return "full_tray";
    return "24oz";
  }, [lines]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then(setCatalog);
  }, []);
  useEffect(() => {
    fetch(`/api/pickup?sizeId=${leadSize}`)
      .then((r) => r.json())
      .then((d) => {
        setPickup(d);
        setDate(d.dates?.[0]?.dateStr ?? "");
        setMin(d.dates?.[0]?.slots?.[0]?.min ?? "");
      });
  }, [leadSize]);

  const taxBps = catalog?.settings?.taxBps ?? 6625;
  const rows = lines.map((l) => {
    const flavor = catalog?.flavors?.find((f: any) => f.skus.some((s: any) => s.id === l.skuId));
    const sku = flavor?.skus.find((s: any) => s.id === l.skuId);
    return { ...l, sku, flavor };
  });
  const subtotal = rows.reduce((s, r) => s + (r.sku ? r.sku.priceCents * r.qty : 0), 0);
  const tax = taxFromSubtotal(subtotal, taxBps);
  const slots = pickup.dates.find((d) => d.dateStr === date)?.slots ?? [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!min || !date) {
      setError("Pickup hours are not available yet.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        note,
        pickupDate: date,
        pickupMin: min,
        lines: lines.map((l) => ({ skuId: l.skuId, qty: l.qty })),
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not place order");
      return;
    }
    clear();
    router.push(data.url);
  }

  if (!hydrated) {
    return (
      <BrandShell>
        <p className="px-4 py-12">Loading cart…</p>
      </BrandShell>
    );
  }

  if (lines.length === 0) {
    return (
      <BrandShell>
        <p className="px-4 py-12">Your cart is empty.</p>
      </BrandShell>
    );
  }

  return (
    <BrandShell>
      <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4 px-4 py-10">
        <h1 className="display text-4xl">Pickup details</h1>
        <p className="text-sm text-[var(--cream-dim)]">Pickup only. We will prepare your order for the time you select. Tax is added on the server from current menu prices.</p>
        {rows.map((r) => (
          <p key={r.skuId}>
            {r.qty}× {r.flavor?.name} {r.sku?.size.label} — {r.sku ? dollarsFromCents(r.sku.priceCents * r.qty) : ""}
          </p>
        ))}
        <p>Subtotal {dollarsFromCents(subtotal)}</p>
        <p>NJ tax {dollarsFromCents(tax)}</p>
        <p className="display text-2xl text-[var(--saffron)]">Due {dollarsFromCents(subtotal + tax)}</p>
        <label className="block">
          Name
          <input required className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          Mobile phone
          <input required className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block">
          Email (optional)
          <input className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          Pickup date
          <select className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" value={date} onChange={(e) => setDate(e.target.value)}>
            {pickup.dates.map((d) => (
              <option key={d.dateStr} value={d.dateStr}>
                {d.dateStr}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Pickup time
          <select
            className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3"
            value={min}
            onChange={(e) => {
              setMin(Number(e.target.value));
              track("pickup_time_selected");
            }}
          >
            {slots.map((s) => (
              <option key={s.min} value={s.min}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Note
          <textarea className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3 py-2" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        {error && <p className="text-[var(--danger)]">{error}</p>}
        <button disabled={busy} className="min-h-11 w-full rounded-full bg-[var(--saffron)] font-semibold text-[var(--ink)]">
          {busy ? "Placing…" : "Pay"}
        </button>
      </form>
    </BrandShell>
  );
}
