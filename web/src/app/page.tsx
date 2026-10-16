import Link from "next/link";
import { getCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { BrandShell } from "@/components/BrandShell";
import { BiryaniGrid } from "@/components/BiryaniGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { BiryaniQuiz } from "@/components/BiryaniQuiz";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ReviewForm } from "@/components/ReviewForm";
import { biryanis, processSteps } from "@/content/biryanis";
import { site, pickupAddress } from "@/content/site";
import { faqPreviewItems } from "@/content/faq";
import { biryaniBySlug } from "@/content/biryanis";

export default async function HomePage() {
  const { flavors, settings } = await getCatalog();
  const approved = await prisma.review.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  const prices: Record<string, number> = {};
  for (const f of flavors) {
    const bowl = f.skus.find((s) => s.sizeId === "24oz");
    if (bowl) prices[f.id] = bowl.priceCents;
  }
  const preview = faqPreviewItems();

  return (
    <BrandShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: "SEVEN",
            description: site.seo.description,
            servesCuisine: "Indian",
            url: "https://indianfoodridgewood.com",
            address: settings
              ? {
                  "@type": "PostalAddress",
                  streetAddress: settings.addressLine1,
                  addressLocality: settings.city,
                  addressRegion: settings.state,
                  postalCode: settings.zip,
                }
              : undefined,
          }),
        }}
      />
      <section className="relative min-h-[88vh] overflow-hidden bg-[var(--night)] text-[var(--ivory)]">
        <img
          src="/images/hero-full-tray.jpg"
          alt="A full tray of biryani being opened"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)] via-black/35 to-black/25" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28">
          <p className="kicker text-[var(--saffron)]">{site.hero.kicker}</p>
          <h1 className="display mt-4 max-w-4xl text-5xl leading-[0.92] sm:text-7xl md:text-8xl">
            {site.hero.title}
            <br />
            {site.hero.titleBreak}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--ivory)]/85">{site.hero.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#the-seven" className="btn btn-accent">
              {site.hero.primaryCta}
            </Link>
            <Link href="/order" className="btn border border-[var(--ivory)] text-[var(--ivory)]">
              {site.hero.secondaryCta}
            </Link>
          </div>
          <p className="mt-6 text-sm text-[var(--ivory)]/70">{site.hero.credit}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading kicker="The menu" id="the-seven" sub="Seven recipes. Three sizes on the order page. Pickup only.">
          Meet the seven
        </SectionHeading>
        <div className="mt-12">
          <BiryaniGrid items={biryanis} prices={prices} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--night)] px-4 py-24 text-[var(--ivory)]">
        <p className="pointer-events-none absolute -right-6 top-0 display text-[12rem] leading-none text-white/5 sm:text-[18rem]">
          7
        </p>
        <div className="relative mx-auto max-w-3xl">
          <p className="kicker text-[var(--saffron)]">Why only seven?</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl">Because more isn’t always better.</h2>
          <div className="mt-8 space-y-5 text-lg text-[var(--ivory)]/80">
            <p>Most restaurants try to give you more choices.</p>
            <p>We decided to do the opposite.</p>
            <p>
              We built this concept around one of the world’s most loved rice dishes and asked a simple question:
            </p>
            <p className="display text-3xl text-[var(--ivory)]">How good could biryani become if we gave it our full attention?</p>
            <p>So we chose seven. Seven recipes with different personalities. Seven combinations worth coming back for.</p>
            <p>Not seventy dishes.</p>
            <p className="display text-3xl">Seven done exceptionally well.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="kicker">{site.kitchen.heading}</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">{site.kitchen.subheading}</h2>
          <div className="mt-6 space-y-4 text-[var(--cream-dim)]">
            {site.kitchen.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link href="/about" className="btn btn-ghost mt-6">
            {site.kitchen.moreLabel}
          </Link>
        </div>
        <div className="overflow-hidden rounded-[var(--radius)]">
          <img src="/images/texture-dark.jpg" alt="Dark kitchen texture, spices" className="h-full min-h-80 w-full object-cover" />
        </div>
      </section>

      <section className="bg-[var(--ivory-2)] px-4 py-20">
        <SectionHeading kicker="The method">
          Biryani isn’t mixed.
          <br />
          It’s built.
        </SectionHeading>
        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li key={s.n} className="rounded-[var(--radius)] bg-[var(--paper)] p-5">
              <p className="display text-3xl text-[var(--saffron)]">{s.n}</p>
              <h3 className="mt-2 font-semibold uppercase tracking-[0.14em]">{s.title}</h3>
              <p className="mt-2 text-sm text-[var(--cream-dim)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading kicker="A short quiz" sub="Three questions. One bowl.">
          Which biryani are you?
        </SectionHeading>
        <div className="mt-10">
          <BiryaniQuiz />
        </div>
      </section>

      <section className="bg-[var(--night)] px-4 py-20 text-[var(--ivory)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="kicker text-[var(--saffron)]">How it works</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Pickup only</h2>
          <p className="mt-4 text-lg text-[var(--ivory)]/80">{site.pickup.body}</p>
          <p className="mt-3 text-[var(--ivory)]/70">{pickupAddress(settings)}</p>
          <Link href="/order" className="btn btn-accent mt-8">
            Order for pickup
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20">
        <SectionHeading kicker="Reviews" sub="Your feedback helps us improve every bowl. Nothing is published until it is approved.">
          Tried one of the seven?
        </SectionHeading>
        {approved.length === 0 ? (
          <p className="mt-8 text-center text-[var(--cream-dim)]">Tell us what you think. Guest reviews will appear here after approval — we do not invent them.</p>
        ) : (
          <ul className="mt-10 space-y-6">
            {approved.map((r) => {
              const b = biryaniBySlug(r.biryaniId) ?? biryanis.find((x) => x.id === r.biryaniId);
              return (
                <li key={r.id} className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-5">
                  <p className="text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                    {r.rating}/5 · {b?.name ?? r.biryaniId}
                  </p>
                  <p className="mt-2 font-semibold">{r.firstName}</p>
                  <p className="mt-2 text-[var(--cream-dim)]">{r.body}</p>
                  {r.photoUrl && <img src={r.photoUrl} alt="" className="mt-3 max-h-48 rounded-lg object-cover" />}
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {r.createdAt.toLocaleDateString("en-US", { timeZone: "America/New_York" })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-10">
          <ReviewForm />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <SectionHeading kicker="Questions">FAQ</SectionHeading>
        <div className="mt-8">
          <FAQAccordion items={preview} />
        </div>
        <p className="mt-6 text-center">
          <Link href="/faq" className="text-[var(--saffron-dim)]">
            All questions
          </Link>
        </p>
      </section>

      <section className="px-4 py-24 text-center">
        <p className="kicker">Pickup only</p>
        <h2 className="display mt-4 text-5xl sm:text-7xl">
          Seven biryanis.
          <br />
          Which one is yours?
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/order" className="btn btn-primary">
            Order for pickup
          </Link>
          <Link href="#the-seven" className="btn btn-ghost">
            Meet the seven
          </Link>
        </div>
      </section>
    </BrandShell>
  );
}
