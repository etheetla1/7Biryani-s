import Link from "next/link";
import { BrandShell } from "@/components/BrandShell";
import { site } from "@/content/site";

export const metadata = { title: "Our story | SEVEN", description: site.kitchen.subheading };

export default function AboutPage() {
  return (
    <BrandShell>
      <article className="mx-auto max-w-2xl px-4 py-16">
        <p className="kicker">Our story</p>
        <h1 className="display mt-3 text-5xl">Seven biryanis. One kitchen.</h1>
        <p className="mt-8 text-lg text-[var(--cream-dim)]">{site.secondary}</p>
        {site.kitchen.body.map((p) => (
          <p key={p} className="mt-4 text-[var(--cream-dim)]">
            {p}
          </p>
        ))}
        <p className="mt-8 text-[var(--cream-dim)]">{site.hero.credit}</p>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Seven is not a second copy of Tabla’s dining menu. It is biryani from that kitchen, on its own site.
        </p>
        <Link href="/order" className="btn btn-primary mt-10">
          Order for pickup
        </Link>
      </article>
    </BrandShell>
  );
}
