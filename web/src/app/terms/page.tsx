import { BrandShell } from "@/components/BrandShell";
import { site } from "@/content/site";

export const metadata = { title: "Terms | SEVEN" };

export default function TermsPage() {
  return (
    <BrandShell>
      <article className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-[var(--cream-dim)]">
        <h1 className="display text-4xl text-[var(--ink)]">Terms</h1>
        <p>Pickup only. You are buying prepared food to collect at the kitchen. We do not offer delivery.</p>
        <p>Prices on the menu are before New Jersey prepared-food sales tax, which we add at checkout from current database prices.</p>
        <p>Half and full trays follow the kitchen’s lead time (order by 5:00 PM Eastern for next-day pickup unless admin changes it). 24 oz is same-day during open hours, with a last-pickup cutoff.</p>
        <p>{site.policies.allergen}</p>
      </article>
    </BrandShell>
  );
}
