"use client";

import { FormEvent, useState } from "react";
import { biryanis } from "@/content/biryanis";
import { track } from "./Tracker";

export function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("busy");
    track("review_submitted");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await fetch("/api/reviews", { method: "POST", body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not send review");
      setStatus("error");
      return;
    }
    setStatus("done");
    form.reset();
  }

  if (status === "done") {
    return (
      <p className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-6 text-lg">
        Thank you. Your review has been received.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-6" onFocus={() => track("review_started")}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          First name
          <input required name="firstName" className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" />
        </label>
        <label className="block">
          Last name (optional)
          <input name="lastName" className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" />
        </label>
      </div>
      <label className="block">
        Email
        <input required type="email" name="email" className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3" />
      </label>
      <label className="block">
        Which biryani
        <select required name="biryaniId" className="mt-1 min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3">
          {biryanis.map((b) => (
            <option key={b.id} value={b.id}>
              {b.number} {b.name} — {b.subtitle}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Rating</legend>
        <div className="mt-2 flex gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1">
              <input required type="radio" name="rating" value={n} />
              {n}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        Review
        <textarea required name="body" minLength={8} rows={5} className="mt-1 w-full rounded-lg border border-[var(--line)] bg-[var(--ivory)] px-3 py-2" />
      </label>
      <label className="block">
        Photo (optional)
        <input name="photo" type="file" accept="image/*" className="mt-1 w-full text-sm" />
      </label>
      <label className="flex min-h-11 items-start gap-2">
        <input required type="checkbox" name="consent" className="mt-1" />
        <span>I allow Seven to publish this review on the website if it is approved.</span>
      </label>
      {error && <p className="text-[var(--danger)]">{error}</p>}
      <button disabled={status === "busy"} className="btn btn-primary">
        {status === "busy" ? "Sending…" : "Submit review"}
      </button>
      <p className="text-sm text-[var(--muted)]">Reviews do not appear until the kitchen approves them.</p>
    </form>
  );
}
