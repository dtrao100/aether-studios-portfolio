import type { CaseStudy } from "./types";

export const safetywing: CaseStudy = {
  slug: "safetywing",
  title: "SafetyWing",
  client: "SafetyWing",
  category: "Insurance · Nomad health",
  year: "2023",
  role: "Product designer",
  tagline:
    "Health coverage for digital nomads — policy complexity translated into a checkout that feels like a consumer purchase.",

  snippets: [
    { variant: "placeholder", alt: "Quote flow — coming soon" },
    { variant: "placeholder", alt: "Plan selection — coming soon" },
  ],

  shortNarrative:
    "Stripped policy language down to what actually drives buying decisions. Quote → customize → purchase in under three minutes.",

  longNarrative: `Buying international health insurance is bureaucratic by default. Nomads — the target audience — expect a one-screen Stripe-style experience.

The redesign translated underwriting constraints into plain calendar UX (instead of "policy effective date subject to 14-day waiting period," just show the user when their coverage actually starts). Checkout completion went up; support tickets about plan confusion went down.

Full numbers in the long-form write-up.`,

  status: "live",
};
