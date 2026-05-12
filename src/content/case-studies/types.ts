export type Stat = {
  value: string; // "38%", "$2.1M", "60%"
  label: string; // "filing time cut", "ARR added", etc.
};

export type HeroVariant = "gif" | "video" | "image" | "placeholder";

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string; // "Compliance UX"
  year: string;
  role: string; // "Lead product designer"
  tagline: string; // single sentence

  heroVariant: HeroVariant;
  heroSrc?: string; // path under /public, or external URL for video
  heroAlt?: string;
  heroPoster?: string; // for video — poster image

  stats?: Stat[]; // 0-4 stat chips below hero

  /** Compact narrative — teaser style. 2-3 sentences max per section. */
  problem: string;
  approach: string;
  outcome: string;

  /** Optional Loom / YouTube walkthrough — embedded after the narrative. */
  loomUrl?: string;
  externalLink?: { label: string; href: string };

  status?: "live" | "coming-soon";
};
