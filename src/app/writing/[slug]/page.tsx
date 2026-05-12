import { CATEGORIES } from "@/content/categories";
import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { GenericDrillIn } from "@/components/GenericDrillIn";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const writing = CATEGORIES.find((c) => c.id === "writing");
  return (writing?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function WritingPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  return (
    <>
      <WaveBackground />
      <Sparkles />
      <GenericDrillIn categoryId="writing" slug={slug} metaLabel="WRITING">
        <Content slug={slug} />
      </GenericDrillIn>
    </>
  );
}

function Content({ slug }: { slug: string }) {
  const post = POSTS[slug];
  if (!post) {
    return (
      <section style={s.section}>
        <p style={s.para}>Draft.</p>
      </section>
    );
  }
  return (
    <>
      <div style={s.draftStatus}>
        <span>Draft</span>
        <span>·</span>
        <span>{post.targetDate}</span>
      </div>
      <section style={s.section}>
        <h3 style={s.h3}>What this piece is about</h3>
        <p style={s.para}>{post.summary}</p>
      </section>
      <section style={s.section}>
        <h3 style={s.h3}>The core argument</h3>
        <p style={s.para}>{post.thesis}</p>
      </section>
    </>
  );
}

const POSTS: Record<string, { targetDate: string; summary: string; thesis: string }> = {
  "post-1": {
    targetDate: "Drop targeted mid-2026",
    summary:
      "Why most compliance UX is bad on purpose, and what changes when you treat the regulator like a stakeholder, not a constraint.",
    thesis:
      "Compliance interfaces fail because designers inherit regulator-shaped vocabulary and replicate it. The unlock is rewriting the user's mental model in plain language, then letting the system handle the mapping back to the regulator. The wizard pattern at Complify is one example.",
  },
  "post-2": {
    targetDate: "Drop targeted mid-2026",
    summary:
      "On authored interfaces, the case for personality over neutrality in B2B SaaS.",
    thesis:
      "Most B2B design defaults to a kind of professional neutrality that's actually a stylistic choice. Neutral isn't 'invisible,' it's 'borrowed.' The interfaces I admire (Linear, Arc, Sublime Text, the PS3 XMB) all picked a register and committed. Authored doesn't mean indulgent; it means having a point of view.",
  },
  "post-3": {
    targetDate: "Drop targeted late 2026",
    summary:
      "Building Aether Studios at 23: solo design as a business model, AI-native as compounding leverage, and what changed when I stopped pretending to be a small agency.",
    thesis:
      "The 'small agency' framing has been a trap for solo designers since 2010. AI-native workflows give one person the throughput of a four-person studio at a quarter of the operational drag. The shift is from 'team you wish you had' to 'system you actually built.'",
  },
};

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 28 },
  draftStatus: {
    display: "flex",
    gap: 10,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    opacity: 0.55,
    marginBottom: 26,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
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
