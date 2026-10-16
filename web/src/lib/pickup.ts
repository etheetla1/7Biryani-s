export type NyParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  dateStr: string;
};

export function nyParts(date = new Date(), tz = "America/New_York"): NyParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const weekMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  return {
    year,
    month,
    day,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: weekMap[parts.weekday] ?? 0,
    dateStr: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

export function addDays(dateStr: string, days: number) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export function weekdayOf(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function minutesOf(hhmm: { hour: number; minute: number }) {
  return hhmm.hour * 60 + hhmm.minute;
}

export type HourRow = { weekday: number; openMin: number | null; closeMin: number | null };

export function lastPickupMin(closeMin: number, cutoffMinutes: number) {
  return Math.max(0, closeMin - cutoffMinutes);
}

export function slotsForDay(openMin: number, lastMin: number, step = 15) {
  const out: number[] = [];
  for (let t = openMin; t <= lastMin; t += step) out.push(t);
  return out;
}

export function formatMin(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function nyDateTimeToUtc(dateStr: string, min: number, tz = "America/New_York") {
  const hour = Math.floor(min / 60);
  const minute = min % 60;
  const guess = new Date(`${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`);
  const asNy = nyParts(guess, tz);
  const wanted = hour * 60 + minute;
  const got = asNy.hour * 60 + asNy.minute;
  return new Date(guess.getTime() + (wanted - got) * 60_000);
}

export function earliestPickupDate(opts: {
  sizeId: string;
  hours: HourRow[];
  closures: Set<string>;
  trayOrderByHour: number;
  trayLeadDays: number;
  cutoffMinutes: number;
  now?: Date;
  tz?: string;
}) {
  const now = nyParts(opts.now, opts.tz);
  const nowMin = now.hour * 60 + now.minute;
  let start = now.dateStr;

  if (opts.sizeId === "24oz") {
    const todayHours = opts.hours.find((h) => h.weekday === now.weekday);
    if (
      todayHours?.openMin != null &&
      todayHours.closeMin != null &&
      nowMin >= todayHours.openMin &&
      nowMin <= lastPickupMin(todayHours.closeMin, opts.cutoffMinutes)
    ) {
      start = now.dateStr;
    } else {
      start = addDays(now.dateStr, 1);
    }
  } else {
    const lead = opts.trayLeadDays;
    if (now.hour >= opts.trayOrderByHour) {
      start = addDays(now.dateStr, lead + 1);
    } else {
      start = addDays(now.dateStr, lead);
    }
  }

  for (let i = 0; i < 21; i++) {
    const dateStr = addDays(start, i);
    if (opts.closures.has(dateStr)) continue;
    const wd = weekdayOf(dateStr);
    const h = opts.hours.find((x) => x.weekday === wd);
    if (h?.openMin == null || h.closeMin == null) continue;
    return dateStr;
  }
  return null;
}

export function pickupSlotsOnDate(opts: {
  dateStr: string;
  hours: HourRow[];
  closures: Set<string>;
  cutoffMinutes: number;
  sizeId: string;
  now?: Date;
  tz?: string;
}) {
  if (opts.closures.has(opts.dateStr)) return [];
  const wd = weekdayOf(opts.dateStr);
  const h = opts.hours.find((x) => x.weekday === wd);
  if (h?.openMin == null || h.closeMin == null) return [];
  const last = lastPickupMin(h.closeMin, opts.cutoffMinutes);
  let slots = slotsForDay(h.openMin, last);
  const now = nyParts(opts.now, opts.tz);
  if (opts.sizeId === "24oz" && opts.dateStr === now.dateStr) {
    const nowMin = now.hour * 60 + now.minute;
    slots = slots.filter((s) => s >= nowMin + 15);
  }
  return slots;
}
