import type { CaseStudy } from "./types";

export const complify: CaseStudy = {
  slug: "complify",
  title: "Activation and Workflow Clarity",
  client: "Complify",
  category: "Conviction-backed · AI-native audit",
  year: "2025",
  role: "Product designer · solo lead",
  tagline:
    "New users couldn't tell what they needed to do, in what order, or when they were “done.” I redesigned the end-to-end audit workflow from blank state to completed review.",

  snippets: [
    {
      variant: "video",
      src: "/case-studies/complify/complify-wizard.mp4",
      poster: "/case-studies/complify/complify-wizard.png",
      alt: "Wizard-based audit spec setup walkthrough",
      caption:
        "Wizard-based audit spec setup: control type → details → test plan → sampling. Auditors don't think in configurable nodes, they think in sequential steps.",
    },
    {
      variant: "image",
      src: "/case-studies/complify/complify-population.png",
      alt: "Population-level testing",
      caption: "Population-level testing runs automatically on upload, completeness, coverage, segregation of duties.",
    },
    {
      variant: "image",
      src: "/case-studies/complify/complify-export.png",
      alt: "Export to D&T testing sheet format",
      caption: "Export drops into the D&T testing sheet format auditors already use, minimal friction adoption.",
    },
  ],

  stats: [
    { value: "18+", label: "Hosted prototypes shipped in 3 months" },
    { value: "RSM", label: "Paid pilot signed off the prototype work" },
    { value: "30m", label: "Audit spec creation, down from days" },
  ],

  shortNarrative:
    "Pivoted from a node-based configurator to a wizard workflow that mirrored how auditors actually set up a review. Complify signed a paid pilot with RSM, one of the largest audit firms in the US, directly off the prototype work.",

  longSections: [
    {
      heading: "Problem",
      body:
        "The first build leaned on node-based configuration. New users hesitated. User testing showed auditors don't think in nodes, they think in sequential steps.",
    },
    {
      heading: "What I shipped",
      bullets: [
        "Wizard-based setup: control type → details → test plan → sampling",
        "3-panel review: source document viewer, AI test results, sample sidebar",
        "Population-level testing: completeness, coverage, segregation of duties",
        "Design system in Figma and code, scaling across very different client data structures",
      ],
    },
    {
      heading: "Process",
      body:
        "18+ hosted prototypes in 3 months. Real audit data from Zillow (365 employees, 53 flagged samples) and SeatGeek (1,500+ review items) drove every iteration. Auditor sessions ran the same sprint prototypes shipped.",
    },
    {
      heading: "Outcome",
      body:
        "Paid pilot signed with RSM in the first sales call off the prototype work. Audit spec creation reduced from days to under 30 minutes. Engagement continues into the next set of product work.",
      quote: {
        text: "Danny picked up our auditor compliance domain faster than people who've worked in GRC for years. He was shipping hosted prototypes fast enough that we ran real auditor sessions the same sprint he built them.",
        attribution: "Morris Hsu, Co-founder & CEO, Complify",
      },
    },
  ],

  collaborators: [
    { role: "Co-founder & CEO", name: "Morris Hsu" },
  ],

  // Figma link removed — the current showcase file is titled "Logical | Showcase"
  // (different startup) and would misrepresent the case study if clicked. Re-add
  // with a properly-titled ServiceNow-specific export when one exists.

  status: "live",
};
