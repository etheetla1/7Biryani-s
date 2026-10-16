"use client";

import { useState } from "react";
import Link from "next/link";
import { recommendBiryani, type QuizAnswers } from "@/content/biryanis";
import { imagePath } from "@/lib/images";
import { SpiceLevel } from "./SpiceLevel";
import { track } from "./Tracker";

const prefs: { id: QuizAnswers["preference"]; label: string }[] = [
  { id: "chicken", label: "Chicken" },
  { id: "lamb", label: "Lamb" },
  { id: "goat", label: "Goat" },
  { id: "seafood", label: "Seafood" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "surprise", label: "Surprise me" },
];
const heats: { id: QuizAnswers["heat"]; label: string }[] = [
  { id: "mild", label: "Mild" },
  { id: "medium", label: "Medium" },
  { id: "hot", label: "Hot" },
];
const cravings: { id: QuizAnswers["craving"]; label: string }[] = [
  { id: "comfort", label: "Rich & comforting" },
  { id: "aromatic", label: "Aromatic & balanced" },
  { id: "spicy", label: "Bold & spicy" },
  { id: "adventurous", label: "Something adventurous" },
];

export function BiryaniQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const result =
    answers.preference && answers.heat && answers.craving
      ? recommendBiryani(answers as QuizAnswers)
      : null;

  function pick<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K], next: number) {
    if (step === 0) track("quiz_started");
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    setStep(next);
    if (next === 3 && nextAnswers.preference && nextAnswers.heat && nextAnswers.craving) {
      const rec = recommendBiryani(nextAnswers as QuizAnswers);
      track("quiz_completed", { itemId: rec.slug });
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper)] p-6">
      {step === 0 && (
        <fieldset>
          <legend className="display text-2xl">Choose your preference</legend>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {prefs.map((p) => (
              <button key={p.id} type="button" className="btn btn-ghost" onClick={() => pick("preference", p.id, 1)}>
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 1 && (
        <fieldset>
          <legend className="display text-2xl">Choose your heat</legend>
          <div className="mt-4 grid gap-2">
            {heats.map((p) => (
              <button key={p.id} type="button" className="btn btn-ghost" onClick={() => pick("heat", p.id, 2)}>
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 2 && (
        <fieldset>
          <legend className="display text-2xl">What are you craving?</legend>
          <div className="mt-4 grid gap-2">
            {cravings.map((p) => (
              <button key={p.id} type="button" className="btn btn-ghost" onClick={() => pick("craving", p.id, 3)}>
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 3 && result && (
        <div>
          <p className="kicker">Your biryani</p>
          <div className="mt-4 overflow-hidden rounded-[var(--radius)]">
            <img src={imagePath(result.flavorId)} alt="" className="h-48 w-full object-cover" />
          </div>
          <h3 className="display mt-4 text-3xl">
            {result.number} {result.name}
          </h3>
          <p className="text-[var(--cream-dim)]">{result.subtitle}</p>
          <p className="mt-2">{result.shortDescription}</p>
          <div className="mt-3">
            <SpiceLevel level={result.spiceLevel} />
          </div>
          <Link href={`/order?biryani=${result.slug}`} className="btn btn-primary mt-6">
            Order this biryani
          </Link>
          <button type="button" className="btn btn-ghost mt-3" onClick={() => { setStep(0); setAnswers({}); }}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
