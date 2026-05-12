import type { CaseStudy } from "./types";

export const servicenow: CaseStudy = {
  slug: "servicenow",
  title: "Context-Persistent Tools for Agent Workflows",
  client: "ServiceNow",
  category: "Enterprise B2B · Agent Workspace",
  year: "2024",
  role: "Contract product designer · solo lead",
  tagline:
    "Customer service agents had no good place to capture case-critical information during live calls. Sensitive data was ending up on sticky notes and Notepad.exe.",

  snippets: [
    {
      variant: "image",
      src: "/case-studies/servicenow/servicenow-hero.png",
      alt: "ServiceNow Agent Workspace with integrated notepad, hero",
      caption:
        "Agent Workspace with the notepad living inside the workspace. No context switching, no external tools, no compliance gap.",
    },
    {
      variant: "image",
      src: "/case-studies/servicenow/servicenow-notepad.png",
      alt: "Notepad component, case-level and global notes",
      caption:
        "Case-level and global notepads with search, rich text, and one-click creation. Always accessible without interrupting task flow.",
    },
    {
      variant: "image",
      src: "/case-studies/servicenow/servicenow-dashboard.png",
      alt: "Agent dashboard with business impact analysis",
      caption: "Agent dashboard. Surfaces business impact and AI-suggested resolutions inline.",
    },
    {
      variant: "image",
      src: "/case-studies/servicenow/servicenow-case.png",
      alt: "Frontline case page with integrated notepad",
      caption: "Frontline case page, notepad is open by default, agents never leave the workspace.",
    },
  ],

  stats: [
    { value: "8K+", label: "Monthly agents using it" },
    { value: "100%", label: "Adoption rate" },
    { value: "~0", label: "External notepad usage (was ubiquitous)" },
    { value: "20", label: "Prototype iterations" },
  ],

  shortNarrative:
    "Built case-level + global notepads that live inside the Agent Workspace. Sensitive customer data stopped leaving the platform. Shipped to 8,000+ monthly agents across Starbucks, Spectrum, Disney, Jack in the Box, and Zillow.",

  longSections: [
    {
      heading: "Problem",
      body:
        "ServiceNow's interface relied on rigid, structured fields. When agent-captured information didn't fit predefined schemas, agents resorted to sticky notes and Notepad.exe. Sensitive customer data lived outside the platform.",
    },
    {
      heading: "What I shipped",
      bullets: [
        "Case-level notepad tied to the active customer issue",
        "Global agent-level notepad persisting across cases",
        "Always accessible without interrupting task flow",
        "AI support inline: case summaries, knowledge base surfacing, suggested resolutions",
      ],
    },
    {
      heading: "Process",
      body:
        "15 user testing sessions over 3 months, ~20 prototype iterations. Tested with frontline agents from Starbucks, Spectrum, Disney, Jack in the Box, and Zillow. I led end-to-end as the only designer after the team lead stepped back early and the senior project lead had a family emergency.",
    },
    {
      heading: "Outcome",
      body:
        "Shipped to 8,000+ monthly agents. 100% adoption among agents who needed the feature. External notepad usage dropped to near-zero, solving the original compliance problem of sensitive data living outside the platform.",
    },
  ],

  // Figma link removed — the current showcase file is titled "Logical | Showcase"
  // (different startup). Re-add when a properly-titled ServiceNow-specific file exists.

  status: "live",
};
