import { BrandShell } from "@/components/BrandShell";
import { FAQAccordion } from "@/components/FAQAccordion";
import { faqGroups } from "@/content/faq";

export const metadata = {
  title: "FAQ | SEVEN",
  description: "Ordering, pickup, food, reviews, and what to do if something is wrong.",
};

export default function FaqPage() {
  return (
    <BrandShell>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="kicker">Help</p>
        <h1 className="display mt-2 text-5xl">FAQ</h1>
        <p className="mt-3 text-[var(--cream-dim)]">Pickup only. Seven biryanis. No delivery.</p>
        <div className="mt-10 space-y-10">
          {faqGroups.map((g) => (
            <section key={g.id}>
              <h2 className="display text-3xl">{g.heading}</h2>
              <FAQAccordion items={g.items} />
            </section>
          ))}
        </div>
      </div>
    </BrandShell>
  );
}
