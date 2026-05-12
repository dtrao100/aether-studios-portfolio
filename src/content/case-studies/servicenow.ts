import type { CaseStudy } from "./types";

export const servicenow: CaseStudy = {
  slug: "servicenow",
  title: "ServiceNow",
  client: "ServiceNow",
  category: "Enterprise workflow",
  year: "2024",
  role: "Product designer",
  tagline:
    "Multi-stakeholder enterprise workflows simplified for daily operators.",

  snippets: [
    { variant: "placeholder", alt: "Workflow overview — coming soon" },
    { variant: "placeholder", alt: "Approval flow — coming soon" },
  ],

  shortNarrative:
    "Surfaced the critical path. Pushed configuration into progressive layers. Built a navigation pattern that scaled from 3 to 30 steps without losing operator confidence.",

  longNarrative: `Enterprise workflows compound complexity with every stakeholder added. Operators were navigating dozens of nested approval steps with unclear ownership.

The redesign separated the *frequent* path from the *configurable* edges. Frequent: a single linear flow with clear next-step affordance. Edges: dedicated configuration screens that the daily operator rarely needs to touch but the admin owns.

Full metrics + screen-by-screen breakdown coming in v2 of this page.`,

  status: "live",
};
