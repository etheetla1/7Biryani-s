export function DietaryBadge({ diet }: { diet: "veg" | "non-veg" }) {
  return (
    <span className="rounded-full border border-[var(--line-strong)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
      {diet === "veg" ? "Veg" : "Non-veg"}
    </span>
  );
}
