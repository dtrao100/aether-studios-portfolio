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
        <section style={{ marginBottom: 36 }}>
          <h3 style={h3}>Draft</h3>
          <p style={para}>
            This essay is still being written. Check back in v2.
          </p>
        </section>
      </GenericDrillIn>
    </>
  );
}

const h3: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 2,
  textTransform: "uppercase",
  opacity: 0.55,
  margin: "0 0 14px",
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 600,
};
const para: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.65,
  margin: "0 0 18px",
  opacity: 0.88,
  fontWeight: 300,
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  maxWidth: 680,
};
