"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { skuId: string; flavorId: string; sizeId: string; qty: number };

type Ctx = {
  lines: CartLine[];
  hydrated: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (skuId: string, qty: number) => void;
  remove: (skuId: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "ifrw_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      hydrated,
      open,
      setOpen,
      add: (line, qty = 1) => {
        setLines((prev) => {
          const i = prev.findIndex((l) => l.skuId === line.skuId);
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: next[i].qty + qty };
            return next;
          }
          return [...prev, { ...line, qty }];
        });
        setOpen(true);
      },
      setQty: (skuId, qty) => {
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.skuId !== skuId) : prev.map((l) => (l.skuId === skuId ? { ...l, qty } : l)),
        );
      },
      remove: (skuId) => setLines((prev) => prev.filter((l) => l.skuId !== skuId)),
      clear: () => setLines([]),
    }),
    [lines, hydrated, open],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("cart");
  return ctx;
}
