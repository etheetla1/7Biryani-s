import { BrandShell } from "@/components/BrandShell";
import { site } from "@/content/site";

export const metadata = { title: "Contact | SEVEN", description: "Reach the Seven kitchen." };

export default function ContactPage() {
  return (
    <BrandShell>
      <article className="mx-auto max-w-xl px-4 py-16">
        <p className="kicker">Support</p>
        <h1 className="display mt-2 text-5xl">Contact</h1>
        <p className="mt-4 text-[var(--cream-dim)]">{site.contact.note}</p>
        {site.contact.email && <p className="mt-4">{site.contact.email}</p>}
        {site.contact.phone && <p className="mt-2">{site.contact.phone}</p>}
        <p className="mt-6 text-sm text-[var(--muted)]">
          For a problem with an order, include your name, order number, what went wrong, and a photo if it helps.
        </p>
        <p className="mt-4 text-sm">{site.policies.remake}</p>
      </article>
    </BrandShell>
  );
}
