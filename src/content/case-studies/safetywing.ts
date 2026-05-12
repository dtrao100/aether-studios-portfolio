import type { CaseStudy } from "./types";

export const safetywing: CaseStudy = {
  slug: "safetywing",
  title: "SafetyWing",
  client: "SafetyWing",
  category: "Insurance · Nomad health",
  year: "2023",
  role: "Product designer",
  tagline:
    "Health coverage for digital nomads — translating policy complexity into a checkout that feels like a consumer purchase.",

  heroVariant: "placeholder",
  heroAlt: "SafetyWing checkout flow walkthrough placeholder",

  stats: [
    { value: "—", label: "Coming soon" },
    { value: "—", label: "Coming soon" },
  ],

  problem:
    "Buying international health insurance is bureaucratic by default. Nomads — the target audience — expect a one-screen Stripe-style experience.",
  approach:
    "Stripped policy language down to its decision-making essentials. Built a flow where users could quote, customize, and purchase in under 3 minutes. Translated underwriting constraints into plain calendar UX.",
  outcome:
    "Checkout completion went up; support tickets about plan confusion went down. Full numbers in the long-form write-up.",

  status: "live",
};
