import { BrandShell } from "@/components/BrandShell";

export const metadata = { title: "Privacy | SEVEN" };

export default function PrivacyPage() {
  return (
    <BrandShell>
      <article className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-[var(--cream-dim)]">
        <h1 className="display text-4xl text-[var(--ink)]">Privacy</h1>
        <p>We store what we need to fill a pickup order: your name, mobile phone, optional email, and order details.</p>
        <p>
          First-party visit events (page views, add to cart, quiz, checkout) use a random visitor cookie. Those rows do
          not include your phone or email.
        </p>
        <p>Reviews you submit include the email you provide and stay pending until approved.</p>
        <p>We do not run third-party ad pixels. Card payments, when enabled, go through Stripe.</p>
        <p>Indian Food Ridgewood LLC · Ridgewood, NJ.</p>
      </article>
    </BrandShell>
  );
}
