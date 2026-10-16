"use client";

import { useState } from "react";
import type { FaqItem } from "@/content/faq";
import { track } from "./Tracker";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="divide-y divide-[var(--line)]">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex min-h-11 w-full items-center justify-between gap-4 py-4 text-left font-semibold"
              aria-expanded={isOpen}
              onClick={() => {
                const next = isOpen ? null : item.id;
                setOpen(next);
                if (next) track("faq_opened", { itemId: item.id });
              }}
            >
              {item.q}
              <span aria-hidden>{isOpen ? "–" : "+"}</span>
            </button>
            {isOpen && <p className="pb-4 text-[var(--cream-dim)]">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
