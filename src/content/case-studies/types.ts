export type Stat = {
  value: string;
  label: string;
};

export type SnippetVariant = "gif" | "video" | "image" | "placeholder";

export type Snippet = {
  variant: SnippetVariant;
  src?: string; // path under /public or external URL
  poster?: string; // video poster
  alt?: string;
  /** Optional short caption shown beneath this snippet. */
  caption?: string;
  /** Display aspect: defaults to 16/9. Use "9/16" or "4/5" for portrait. */
  aspect?: string;
};

export type Collaborator = {
  role: string; // "VP Product"
  name: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string; // "Compliance UX"
  year: string;
  role: string; // "Lead product designer"
  tagline: string; // single sentence

  /** 2-4 stacked media moments, primary content of the case study. */
  snippets: Snippet[];

  stats?: Stat[];

  /** 1-2 short sentences total, shown directly. */
  shortNarrative: string;

  /** Optional expanded narrative behind a "Read more" toggle. Newline-separated paragraphs. */
  longNarrative?: string;

  collaborators?: Collaborator[];

  loomUrl?: string;
  externalLink?: { label: string; href: string };

  status?: "live" | "coming-soon";
};
