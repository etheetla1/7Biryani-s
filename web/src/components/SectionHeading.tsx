export function SectionHeading({
  kicker,
  children,
  sub,
  id,
}: {
  kicker?: string;
  children: React.ReactNode;
  sub?: string;
  id?: string;
}) {
  return (
    <header id={id} className="mx-auto max-w-3xl text-center">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 className="display mt-3 text-4xl text-[var(--ink)] sm:text-5xl">{children}</h2>
      {sub && <p className="mt-4 text-lg text-[var(--cream-dim)]">{sub}</p>}
    </header>
  );
}
