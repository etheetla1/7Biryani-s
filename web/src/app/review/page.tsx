import { BrandShell } from "@/components/BrandShell";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata = {
  title: "Leave a review | SEVEN",
  description: "Tell us about your biryani. Reviews are approved before they appear.",
};

export default function ReviewPage() {
  return (
    <BrandShell>
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="kicker">After you eat</p>
        <h1 className="display mt-2 text-5xl">Tried one of the seven?</h1>
        <p className="mt-4 text-[var(--cream-dim)]">
          Tell us what you think. Reviews do not go live until the kitchen approves them. We do not invent testimonials.
        </p>
        <div className="mt-8">
          <ReviewForm />
        </div>
      </div>
    </BrandShell>
  );
}
