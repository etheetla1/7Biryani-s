import { site } from "./site";

export type FaqItem = { q: string; a: string; id: string };
export type FaqGroup = { id: string; heading: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "ordering",
    heading: "Ordering",
    items: [
      {
        id: "how-order",
        q: "How do I place an order?",
        a: "Choose your biryani on the Order page, add it to your order, then complete pickup checkout. Ordering does not start on the homepage.",
      },
      {
        id: "delivery",
        q: "Do you offer delivery?",
        a: "Not right now. Seven is pickup only.",
      },
      {
        id: "phone",
        q: "Can I order by phone?",
        a: site.policies.phoneOrders,
      },
      {
        id: "schedule",
        q: "Can I schedule an order ahead of time?",
        a: "Yes. Pickup date and time are chosen at checkout, using the kitchen’s hours and tray lead times once those are set in admin.",
      },
      {
        id: "large",
        q: "Can I place a large order?",
        a: site.policies.largeOrders,
      },
    ],
  },
  {
    id: "pickup",
    heading: "Pickup",
    items: [
      {
        id: "where",
        q: "Where do I pick up my order?",
        a: "Pickup is in Ridgewood, NJ. The configured address appears at checkout when it is set. We do not list unconfirmed hours in the footer.",
      },
      {
        id: "ready",
        q: "How will I know when my order is ready?",
        a: site.pickup.readyNotice,
      },
      {
        id: "late",
        q: "What happens if I'm late?",
        a: site.pickup.holdPolicy,
      },
    ],
  },
  {
    id: "food",
    heading: "The food",
    items: [
      {
        id: "why-seven",
        q: "Why only seven biryanis?",
        a: "The concept is built around focus. Instead of a huge menu, Seven concentrates on seven biryanis so each one can have a distinct identity.",
      },
      {
        id: "all-spicy",
        q: "Are all seven biryanis spicy?",
        a: "No. Each biryani shows a spice scale so you can choose by heat.",
      },
      {
        id: "customize-spice",
        q: "Can I customize the spice level?",
        a: site.policies.spiceCustomize,
      },
      {
        id: "vegetarian",
        q: "Do you have vegetarian options?",
        a: "Yes. The Garden is vegetable biryani. The Tabla is paneer biryani. Both are marked vegetarian on the Order page.",
      },
      {
        id: "vegan",
        q: "Do you have vegan options?",
        a: site.policies.vegan,
      },
      {
        id: "gf",
        q: "Do you offer gluten-free options?",
        a: site.policies.glutenFree,
      },
      {
        id: "halal",
        q: "Is your food halal?",
        a: site.policies.halalCopy,
      },
      {
        id: "allergens",
        q: "Do your dishes contain nuts, dairy or other allergens?",
        a: `${site.policies.allergen} Allergen notes are listed on each biryani where we have them.`,
      },
    ],
  },
  {
    id: "portions",
    heading: "Portions & storage",
    items: [
      {
        id: "serves",
        q: "How many people does one biryani serve?",
        a: "24 oz is for one. Half tray is listed as 7–9 people. Full tray is listed as 19–24 people. Those serving lines come from the kitchen’s current size list.",
      },
      {
        id: "leftovers",
        q: "Can I refrigerate leftovers?",
        a: "Yes. Refrigerate promptly. Avoid overly specific storage promises until the kitchen publishes them.",
      },
      {
        id: "reheat",
        q: "How should I reheat my biryani?",
        a: site.policies.reheat,
      },
    ],
  },
  {
    id: "reviews",
    heading: "Reviews",
    items: [
      {
        id: "leave-review",
        q: "How can I leave a review?",
        a: "Use the Review page or the review section on the homepage.",
      },
      {
        id: "auto-publish",
        q: "Will my review automatically appear on the website?",
        a: "No. Reviews are read before they can appear publicly.",
      },
      {
        id: "photo",
        q: "Can I upload a photo with my review?",
        a: "Yes. Photos are optional and only shown if the review is approved.",
      },
    ],
  },
  {
    id: "problems",
    heading: "Problems with an order",
    items: [
      {
        id: "wrong",
        q: "Something is wrong with my order. What should I do?",
        a: "Contact us with your name, order number, what went wrong, and a photograph if it helps. Support details are on the Contact page.",
      },
      {
        id: "refund",
        q: "What is your refund or remake policy?",
        a: site.policies.remake,
      },
    ],
  },
];

export const faqPreviewIds = ["why-seven", "delivery", "all-spicy", "leave-review"];

export function faqPreviewItems() {
  return faqGroups.flatMap((g) => g.items).filter((i) => faqPreviewIds.includes(i.id));
}
