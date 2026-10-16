export const site = {
  brand: "SEVEN",
  subtitle: "Biryani by Tabla",
  altLockup: "7 BIRYANIS — BY TABLA",
  legalName: "Indian Food Ridgewood LLC",
  domain: "indianfoodridgewood.com",
  tagline: "Seven Biryanis. One Kitchen. No Shortcuts.",
  secondary: "We could have made a bigger menu. We chose to make a better one.",
  hero: {
    kicker: "Pickup only",
    title: "SEVEN BIRYANIS.",
    titleBreak: "THAT'S IT.",
    lede: "Seven distinct biryanis. Cooked by the kitchen behind Tabla. Made for people who believe biryani deserves our full attention.",
    primaryCta: "Explore the 7",
    secondaryCta: "Order for pickup",
    credit: "Cooked in the Tabla kitchen, Ridgewood, NJ.",
  },
  kitchen: {
    heading: "The kitchen behind Seven",
    subheading: "A focused idea from a kitchen built around Indian cuisine.",
    body: [
      "Behind every bowl of Seven is the Tabla kitchen in Ridgewood.",
      "Tabla is a dining room with a full menu. Seven is not that restaurant. It is the same kitchen, giving biryani its own attention.",
      "We do not send you to another website. We cook here, you pick up here.",
    ],
    moreLabel: "Our story",
  },
  pickup: {
    heading: "Pickup only",
    body: "We'll prepare your order for the pickup time you select. No delivery.",
    cityLine: "Ridgewood, NJ",
    addressUnconfirmed: false,
    holdPolicy:
      "If you are late, the kitchen will hold the order for a reasonable period. Biryani is best enjoyed fresh.",
    readyNotice:
      "Order status lives on your confirmation page. Email and SMS notices can be added once those services are configured.",
  },
  policies: {
    halal: true,
    halalCopy: "Meat biryanis are prepared with halal meat. This follows the kitchen’s current practice and can be updated in configuration.",
    allergen:
      "We do not prepare allergen-friendly dishes. If you have a serious allergy, contact us before ordering.",
    spiceCustomize:
      "Spice level is set by each recipe. Custom heat is not offered until the kitchen confirms it.",
    vegan:
      "A vegan option is not listed until recipes and kitchen process are confirmed.",
    glutenFree:
      "We do not claim gluten-free preparation until ingredients and cross-contact procedures are verified.",
    phoneOrders:
      "Phone ordering policy is not set. Use the Order page for now.",
    remake:
      "Refund and remake policy is not published yet. Contact us with your name, order number, and what went wrong.",
    largeOrders:
      "For office, event, or catering-size trays, contact us. No minimum quantity is published yet.",
    reheat:
      "Kitchen-approved reheating instructions will appear here once the owner supplies them. Refrigerate leftovers promptly.",
  },
  contact: {
    email: "",
    phone: "",
    note: "Support contact is not published yet. Use the form on this page and we will add a public phone or email in configuration.",
  },
  social: {
    instagram: "",
    tiktok: "",
    facebook: "",
  },
  seo: {
    title: "Seven Biryanis by Tabla | Focused Biryani Kitchen",
    description:
      "Seven distinct biryanis from the kitchen behind Tabla. Explore the seven and order your favorite for pickup in Ridgewood, NJ.",
  },
} as const;

export function pickupAddress(settings?: {
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
} | null) {
  if (!settings?.addressLine1) return `${site.pickup.cityLine} — exact pickup door listed at checkout when configured.`;
  return `${settings.addressLine1}, ${settings.city}, ${settings.state} ${settings.zip}`;
}
