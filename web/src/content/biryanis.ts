export type SpiceLevel = 1 | 2 | 3 | 4 | 5;
export type Diet = "veg" | "non-veg";
export type Protein =
  | "chicken"
  | "lamb"
  | "beef"
  | "veg"
  | "shrimp"
  | "goat"
  | "paneer";

export type Biryani = {
  id: string;
  number: string;
  slug: string;
  name: string;
  subtitle: string;
  flavorId: Protein;
  proteinLabel: string;
  diet: Diet;
  spiceLevel: SpiceLevel;
  shortDescription: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  dietaryTags: string[];
  recommendedFor: string[];
  recommendationTags: string[];
  featured: boolean;
};

export const biryanis: Biryani[] = [
  {
    id: "classic",
    number: "01",
    slug: "classic",
    name: "The Classic",
    subtitle: "Chicken biryani",
    flavorId: "chicken",
    proteinLabel: "Chicken",
    diet: "non-veg",
    spiceLevel: 2,
    shortDescription: "The familiar one. Basmati, saffron, and chicken.",
    description:
      "Long-grain basmati layered with chicken, fried onion, and saffron. Built for people who want biryani they already understand — then notice how carefully it was put together.",
    ingredients: ["Basmati rice", "chicken", "saffron", "fried onion", "house spice"],
    allergens: ["May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Non-veg"],
    recommendedFor: ["First visit", "Mild to medium heat"],
    recommendationTags: ["chicken", "mild", "medium", "comfort", "aromatic"],
    featured: true,
  },
  {
    id: "royal",
    number: "02",
    slug: "royal",
    name: "The Royal",
    subtitle: "Lamb biryani",
    flavorId: "lamb",
    proteinLabel: "Lamb",
    diet: "non-veg",
    spiceLevel: 3,
    shortDescription: "Lamb, saffron, and a slower kind of richness.",
    description:
      "Lamb biryani with basmati and saffron. Deeper than chicken, calmer than the hottest bowls. For nights when you want the plate to feel considered.",
    ingredients: ["Basmati rice", "lamb", "saffron", "fried onion", "house spice"],
    allergens: ["May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Non-veg"],
    recommendedFor: ["Rich and comforting"],
    recommendationTags: ["lamb", "medium", "comfort", "aromatic"],
    featured: true,
  },
  {
    id: "fire",
    number: "03",
    slug: "fire",
    name: "The Fire",
    subtitle: "Beef biryani",
    flavorId: "beef",
    proteinLabel: "Beef",
    diet: "non-veg",
    spiceLevel: 4,
    shortDescription: "Beef biryani with more heat and a bolder finish.",
    description:
      "Beef layered through basmati with a hotter spice profile. Still biryani — not a chili. Heat is part of the personality, not the only note.",
    ingredients: ["Basmati rice", "beef", "saffron", "fried onion", "house spice"],
    allergens: ["May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Non-veg"],
    recommendedFor: ["Bold and spicy"],
    recommendationTags: ["beef", "hot", "spicy", "adventurous"],
    featured: false,
  },
  {
    id: "garden",
    number: "04",
    slug: "garden",
    name: "The Garden",
    subtitle: "Vegetable biryani",
    flavorId: "veg",
    proteinLabel: "Vegetable",
    diet: "veg",
    spiceLevel: 2,
    shortDescription: "Vegetables, basmati, and saffron — no meat.",
    description:
      "Vegetable biryani with separate grains and a lighter center. Vegetarian, not an afterthought. The heat stays moderate so the vegetables stay clear.",
    ingredients: ["Basmati rice", "mixed vegetables", "saffron", "fried onion", "house spice"],
    allergens: ["May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Vegetarian"],
    recommendedFor: ["Vegetarian", "Milder heat"],
    recommendationTags: ["veg", "vegetarian", "mild", "medium", "aromatic"],
    featured: false,
  },
  {
    id: "coastal",
    number: "05",
    slug: "coastal",
    name: "The Coastal",
    subtitle: "Shrimp biryani",
    flavorId: "shrimp",
    proteinLabel: "Shrimp",
    diet: "non-veg",
    spiceLevel: 2,
    shortDescription: "Shrimp biryani. Brighter, still layered.",
    description:
      "Shrimp with basmati and saffron. A different center from the meat bowls, same method: rice, aromatics, layering, finish. Contains shellfish.",
    ingredients: ["Basmati rice", "shrimp", "saffron", "fried onion", "house spice"],
    allergens: ["Shellfish", "May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Non-veg", "Shellfish"],
    recommendedFor: ["Seafood", "Aromatic and balanced"],
    recommendationTags: ["shrimp", "seafood", "medium", "mild", "aromatic", "adventurous"],
    featured: false,
  },
  {
    id: "goat",
    number: "06",
    slug: "goat",
    name: "The Goat",
    subtitle: "Goat biryani",
    flavorId: "goat",
    proteinLabel: "Goat",
    diet: "non-veg",
    spiceLevel: 3,
    shortDescription: "Goat biryani. Distinct, not a substitute for lamb.",
    description:
      "Goat layered with basmati and saffron. For people who already know they want goat — or who are ready to try the one most menus hide behind chicken.",
    ingredients: ["Basmati rice", "goat", "saffron", "fried onion", "house spice"],
    allergens: ["May contain dairy from ghee or yogurt marinades"],
    dietaryTags: ["Non-veg"],
    recommendedFor: ["Something adventurous"],
    recommendationTags: ["goat", "medium", "hot", "adventurous", "spicy"],
    featured: true,
  },
  {
    id: "tabla",
    number: "07",
    slug: "tabla",
    name: "The Tabla",
    subtitle: "Paneer biryani",
    flavorId: "paneer",
    proteinLabel: "Paneer",
    diet: "veg",
    spiceLevel: 2,
    shortDescription: "Paneer biryani. The house vegetarian bowl.",
    description:
      "Grilled paneer with basmati and saffron. Vegetarian, richer than the garden bowl. Named for the kitchen — not a second restaurant menu.",
    ingredients: ["Basmati rice", "paneer", "saffron", "fried onion", "house spice"],
    allergens: ["Dairy"],
    dietaryTags: ["Vegetarian", "Contains dairy"],
    recommendedFor: ["Vegetarian", "Rich and comforting"],
    recommendationTags: ["paneer", "vegetarian", "veg", "mild", "medium", "comfort"],
    featured: false,
  },
];

export function biryaniBySlug(slug: string) {
  return biryanis.find((b) => b.slug === slug);
}

export function biryaniByFlavorId(flavorId: string) {
  return biryanis.find((b) => b.flavorId === flavorId);
}

export const processSteps = [
  { n: "01", title: "Rice", body: "Long-grain basmati prepared for fragrance and structure." },
  { n: "02", title: "Aromatics", body: "Spices, herbs, onions and other aromatics create the foundation." },
  { n: "03", title: "The center", body: "Protein or vegetables prepared specifically for each recipe." },
  { n: "04", title: "Layering", body: "Rice and the other components are brought together in layers." },
  { n: "05", title: "Finishing", body: "Heat, time and technique bring those layers together." },
  { n: "06", title: "Open", body: "The aroma is part of the experience." },
  { n: "07", title: "Eat", body: "Seven recipes. One method. Your bowl." },
] as const;

export type QuizAnswers = {
  preference: "chicken" | "lamb" | "goat" | "seafood" | "vegetarian" | "surprise";
  heat: "mild" | "medium" | "hot";
  craving: "comfort" | "aromatic" | "spicy" | "adventurous";
};

export function recommendBiryani(a: QuizAnswers): Biryani {
  if (a.preference === "chicken") return biryaniBySlug("classic")!;
  if (a.preference === "lamb") return biryaniBySlug("royal")!;
  if (a.preference === "goat") return biryaniBySlug("goat")!;
  if (a.preference === "seafood") return biryaniBySlug("coastal")!;
  if (a.preference === "vegetarian") {
    if (a.craving === "comfort") return biryaniBySlug("tabla")!;
    return biryaniBySlug("garden")!;
  }
  if (a.heat === "hot" || a.craving === "spicy") return biryaniBySlug("fire")!;
  if (a.craving === "adventurous") return biryaniBySlug("goat")!;
  if (a.heat === "mild") return biryaniBySlug("classic")!;
  return biryaniBySlug("royal")!;
}
