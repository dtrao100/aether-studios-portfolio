import type { CaseStudy } from "./types";

export const servicenow: CaseStudy = {
  slug: "servicenow",
  title: "ServiceNow",
  client: "ServiceNow",
  category: "Enterprise workflow",
  year: "2024",
  role: "Product designer",
  tagline:
    "Workflow design at enterprise scale — complex multi-stakeholder flows simplified for daily operators.",

  heroVariant: "placeholder",
  heroAlt: "ServiceNow workflow walkthrough placeholder",

  stats: [
    { value: "—", label: "Coming soon" },
    { value: "—", label: "Coming soon" },
  ],

  problem:
    "Enterprise workflows compound complexity with every stakeholder added. Operators were navigating dozens of nested approval steps with unclear ownership.",
  approach:
    "Surfaced the critical path. Pushed configuration and edge cases into progressive layers. Built a navigation pattern that scaled from 3 steps to 30 without losing operator confidence.",
  outcome:
    "Pilot teams reported faster ticket resolution and significantly lower context-switching cost. Detailed metrics coming in the full write-up.",

  status: "live",
};
