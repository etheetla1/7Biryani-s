import type { SpiceLevel } from "@/content/biryanis";

export function SpiceLevel({ level, label = true }: { level: SpiceLevel; label?: boolean }) {
  const words = ["Mild", "Mild", "Medium", "Hot", "Hot"];
  return (
    <div className="flex items-center gap-2" aria-label={`Spice ${words[level - 1]}`}>
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`h-2 w-2 rounded-full ${n <= level ? "bg-[var(--copper)]" : "bg-[var(--line-strong)]"}`}
          />
        ))}
      </span>
      {label && <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{words[level - 1]}</span>}
    </div>
  );
}
