import type { CaseStudy } from "./types";

export const complify: CaseStudy = {
  slug: "complify",
  title: "Complify",
  client: "Complify",
  category: "Compliance UX",
  year: "2025",
  role: "Lead product designer",
  tagline:
    "Redesigning Form 5500 workflows for retirement plan administrators handling thousands of filings per year.",

  heroVariant: "placeholder",
  // TODO: replace with /public/case-studies/complify/hero.gif
  heroAlt: "Complify Form 5500 workflow — animated walkthrough placeholder",

  stats: [
    { value: "38%", label: "Avg. filing time reduction (pilot cohort)" },
    { value: "60%", label: "Validation errors at submission, down" },
    { value: "1", label: "Solo-design, shipped in production" },
  ],

  problem:
    "Form 5500 submissions involve dozens of conditional fields, schedules, and supporting attachments. A single missed field can cost a TPA hours of corrections — at scale, hundreds of those errors compound into seven-figure operational drag.",
  approach:
    "Two-tier validation hierarchy. Progressive disclosure of advanced schedules. Inline DOL-language guidance written for administrators, not regulators. Every form state recoverable from a partially-filed save.",
  outcome:
    "Pilot cohort cut average filing time by 38%. Validation errors at submission dropped 60%. The redesigned flow shipped to production and now anchors the platform's onboarding.",

  // TODO: loomUrl: "https://www.loom.com/share/...",
  // TODO: externalLink: { label: "Visit Complify", href: "https://complify.com" },

  status: "live",
};
