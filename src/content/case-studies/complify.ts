import type { CaseStudy } from "./types";

export const complify: CaseStudy = {
  slug: "complify",
  title: "Activation and Workflow Clarity",
  client: "Complify",
  category: "Compliance UX · AI-native audit",
  year: "2025",
  role: "Product designer · solo lead",
  tagline:
    "New users couldn't tell what they needed to do, in what order, or when they were “done.” I redesigned the end-to-end audit workflow from blank state to completed review.",

  snippets: [
    {
      variant: "image",
      src: "/case-studies/complify/complify-hero.png",
      alt: "Complify 3-panel audit review — hero",
      caption:
        "Core product: 3-panel layout. Source document viewer, AI test results, sample sidebar. Each sample runs 4 automated tests against source evidence with confidence scores visible on every field.",
    },
    {
      variant: "gif",
      src: "/case-studies/complify/complify-wizard.gif",
      alt: "Wizard-based audit spec setup",
      caption:
        "Wizard-based audit spec setup: control type → details → test plan → sampling. Auditors don’t think in nodes; they think in sequential steps.",
    },
    {
      variant: "image",
      src: "/case-studies/complify/complify-sidebar.png",
      alt: "3-panel review layout with sidebar",
      caption: "Sample-by-sample review with AI-extracted fields and source tracing.",
    },
    {
      variant: "image",
      src: "/case-studies/complify/complify-population.png",
      alt: "Population-level testing",
      caption: "Population-level testing runs automatically on upload — completeness, coverage, segregation of duties.",
    },
    {
      variant: "image",
      src: "/case-studies/complify/complify-export.png",
      alt: "Export to D&T testing sheet format",
      caption: "Export drops into the D&T testing sheet format auditors already use.",
    },
  ],

  stats: [
    { value: "18+", label: "Hosted prototypes shipped in 3 months" },
    { value: "RSM", label: "Paid pilot signed off the prototype work" },
    { value: "30m", label: "Audit spec creation, down from days" },
  ],

  shortNarrative:
    "Pivoted from a node-based configurator to a wizard workflow that mirrored how auditors actually set up a review. Complify signed a paid pilot with RSM — one of the largest audit firms in the US — directly off the prototype work.",

  longNarrative: `Complify is an AI compliance platform that automates User Access Reviews — the audit workflows that today live in spreadsheets. The setup experience exposed too many requirements at once. New users hesitated, churned early, and never made it to the actual audit work.

The first build leaned on node-based configuration. Through user testing it became clear that auditors don’t think in terms of configurable nodes. They think in sequential steps: select control type, fill details, define test plan, configure sampling. I pivoted the setup to a wizard that mirrors that mental model, and made the core review a 3-panel layout: source document viewer, AI test results, sample sidebar. Every AI-extracted field has confidence scoring and a trace back to the source.

Shipped 18+ hosted prototypes over 3 months, testing each with real audit data from Zillow Home Loans (365 employees, 53 flagged samples) and SeatGeek (1,500+ review items). New prototypes went out fast enough to run real auditor sessions the same sprint they were built. I also built the Complify design system end-to-end — reusable components for data tables, confidence indicators, test result cards, field extraction states, and document viewers — scaling across very different client data structures.

Outcome: Complify signed a paid pilot with RSM directly off the prototype work. No competitor had removed the friction from node configuration; the new design moved prospective clients to "buy in" immediately. Wizard-based setup reduced audit spec creation from a multi-day manual process to under 30 minutes. The engagement kept going — I continued leading the next set of product work.

Testimonials: "Danny picked up our auditor compliance domain faster than people who’ve worked in GRC for years. He was shipping hosted prototypes fast enough that we ran real auditor sessions the same sprint he built them." — Morris Hsu, Co-founder & CEO, Complify. "I'm shocked. This is really good, and it was done so quick. UAR is a very complicated workflow, now made intuitive and easy." — Scott, Internal Auditor, SeatGeek. "The workflow just makes sense. Easy to follow and use right away, even seeing it for the first time. This is perfect!" — Anamika, Compliance Analyst, Zillow.`,

  collaborators: [
    { role: "Co-founder & CEO", name: "Morris Hsu" },
  ],

  externalLink: {
    label: "View design system in Figma",
    href: "https://www.figma.com/design/nRdzOac3gTm3jMoIqPckxx/Logical-%7C-Showcase?node-id=0-1",
  },

  status: "live",
};
