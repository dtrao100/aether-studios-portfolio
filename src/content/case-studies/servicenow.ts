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

  longNarrative: `Customer service agents handle live cases across phone, email, and queued requests. They constantly need to capture case-critical or sensitive information while actively working with a customer. ServiceNow's interface relied on rigid, structured fields. When information didn't fit predefined schemas, or was only temporarily relevant, agents had no appropriate place to record it.

The result: physical sticky notes and local OS notepads. Sensitive customer data lived outside the platform, creating security, compliance, and workflow reliability risk. Agents were thinking on their feet during live calls with no good place to capture what mattered.

The core idea was a notepad that lives inside the workspace, case-level notes tied to an active issue, and global agent-level notes that persist across cases. Both accessible without interrupting task flow, fully contained within the secure platform environment. Integrated AI support for case summaries, knowledge base surfacing, and suggested resolutions.

Process: 15 user testing sessions over 3 months, with new prototypes every 3 days based on feedback, ~20 iterations total. Tested with agents at Starbucks, Spectrum, Disney, Jack in the Box, and Zillow before landing on the final design. I led this end-to-end as the only designer: the team lead stepped back early due to an org restructuring and the senior project lead had a family emergency, so I took over solo while onboarding new international PMs.

Outcome: 100% adoption across agents who needed it, 8,000+ monthly agents across the enterprise client base. External notepad usage dropped to near-zero, the original problem of sensitive data living outside the platform was solved. Activation and ticket handling both improved.`,

  externalLink: {
    label: "View in Figma",
    href: "https://www.figma.com/design/nRdzOac3gTm3jMoIqPckxx/Logical-%7C-Showcase?node-id=0-1",
  },

  status: "live",
};
