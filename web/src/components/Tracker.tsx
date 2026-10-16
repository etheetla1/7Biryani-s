"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function Tracker() {
  const path = usePathname();
  const sp = useSearchParams();
  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        path,
        referrer: document.referrer || null,
        utmSource: sp.get("utm_source"),
        utmMedium: sp.get("utm_medium"),
        utmCampaign: sp.get("utm_campaign"),
      }),
    }).catch(() => {});
  }, [path, sp]);
  return null;
}

export function track(type: string, extra?: { itemId?: string; sizeId?: string }) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, path: window.location.pathname, ...extra }),
  }).catch(() => {});
}
