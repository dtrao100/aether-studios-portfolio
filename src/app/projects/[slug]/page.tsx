import { CATEGORIES } from "@/content/categories";
import { GenericDrillIn } from "@/components/GenericDrillIn";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = CATEGORIES.find((c) => c.id === "projects");
  return (projects?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  return (
    <GenericDrillIn categoryId="projects" slug={slug} metaLabel="SIDE PROJECT">
      <Content slug={slug} />
    </GenericDrillIn>
  );
}

function Content({ slug }: { slug: string }) {
  const project = PROJECTS[slug];
  if (!project) {
    return (
      <section style={s.section}>
        <p style={s.para}>Coming soon.</p>
      </section>
    );
  }
  return (
    <>
      <section style={s.section}>
        <h3 style={s.h3}>What it is</h3>
        <p style={s.para}>{project.what}</p>
      </section>
      <section style={s.section}>
        <h3 style={s.h3}>Why</h3>
        <p style={s.para}>{project.why}</p>
      </section>
      <section style={s.section}>
        <h3 style={s.h3}>Status</h3>
        <p style={s.para}>{project.status}</p>
      </section>
    </>
  );
}

const PROJECTS: Record<string, { what: string; why: string; status: string }> = {
  "aether-gazette": {
    what:
      "A short-form publication on the seam between design and AI. One issue every couple of weeks. Essays, teardowns, working prototypes, not opinions.",
    why:
      "Most design writing is either commentary or theory. Aether Gazette is a third thing: the thing I'd want to read while I'm in the middle of working. Bias toward what shipped this week, not what we should think about.",
    status:
      "Drafts in progress. Public launch targeted for late Q3 2026. Subscribe link will live here once the first piece ships.",
  },
  "amazing-digital-library": {
    what:
      "An index of the design references I actually return to. Not 'inspiration', references with notes on why each one earned the slot.",
    why:
      "Are.na and Mymind both undercommit on synthesis. I wanted a personal version that's opinionated about which references survive the year. The bar is: would I open this in a client conversation tomorrow?",
    status: "Building the schema. Public when there are 100+ entries with notes.",
  },
  study: {
    what:
      "A small tool for reviewing flashcards backed by spaced repetition, but tuned for the kind of qualitative material designers actually study (typography pairs, layout patterns, naming conventions) rather than vocabulary.",
    why:
      "Anki is built for medical school. Pixel-snappy review of subjective taste-trainers needs a different surface.",
    status:
      "Personal use working. Public web app TBD, I want to see if I keep using it after the first 60 days first.",
  },
  "digital-mailbox": {
    what:
      "An inbox-shaped reader for the few newsletters, threads, and RSS feeds I actually want to read. Built around the idea that 'unread' should mean 'unread by me,' not 'recently published.'",
    why:
      "Most readers optimize for fresh-content firehose. I optimize for: did I actually engage with this thing, and is it ready to come off the queue?",
    status:
      "Local prototype. Not a public release, I'm not trying to compete with Readwise. But the design pattern might be reusable.",
  },
};

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 28 },
  h3: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.55,
    margin: "0 0 12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 600,
  },
  para: {
    fontSize: 17,
    lineHeight: 1.65,
    margin: "0 0 12px",
    opacity: 0.9,
    fontWeight: 300,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 680,
  },
};
