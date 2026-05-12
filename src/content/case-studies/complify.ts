import type { CaseStudy } from "./types";

export const complify: CaseStudy = {
  slug: "complify",
  title: "Complify",
  client: "Complify",
  category: "Compliance UX",
  year: "2025",
  role: "Lead product designer",
  tagline:
    "Form 5500 workflows redesigned for retirement plan administrators handling thousands of filings a year.",

  snippets: [
    {
      variant: "placeholder",
      alt: "Hero — Form 5500 walkthrough",
      caption: "Two-tier validation hierarchy. Progressive disclosure of advanced schedules.",
    },
    {
      variant: "placeholder",
      alt: "Audit tool interaction",
      caption: "Inline DOL-language guidance, written for administrators — not regulators.",
    },
    {
      variant: "placeholder",
      alt: "Results dashboard",
      caption: "Every form state recoverable from a partially-filed save.",
    },
  ],

  stats: [
    { value: "38%", label: "Avg. filing time, down" },
    { value: "60%", label: "Submission errors, down" },
    { value: "1", label: "Solo-design, shipped" },
  ],

  shortNarrative:
    "Pilot cohort cut filing time by 38% and dropped validation errors by 60%. The redesigned Form 5500 flow shipped to production and now anchors the platform's onboarding.",

  longNarrative: `Form 5500 submissions involve dozens of conditional fields, schedules, and supporting attachments. A single missed field can cost a TPA hours of corrections — at scale, hundreds of those errors compound into seven-figure operational drag.

The core move was a two-tier validation hierarchy: hard blockers for DOL-rejection-worthy issues, soft warnings for everything else. Advanced schedules sat behind progressive disclosure so the default path stayed clean for the 80% case. DOL language got rewritten in the voice of an administrator, not a regulator — because the people filing aren't lawyers.

Every form state had to be recoverable from a partially-filed save. Pre-existing prototypes had this as a nice-to-have; we made it the foundation. The result was a flow administrators could pick up and put down across a 9-month filing cycle without losing context.`,

  collaborators: [
    { role: "Founder & CEO", name: "Morris Brodie" },
    // TODO: add eng/PM collaborators if appropriate
  ],

  // TODO: loomUrl: "https://www.loom.com/share/...",
  // TODO: externalLink: { label: "Visit Complify", href: "https://complify.com" },

  status: "live",
};
