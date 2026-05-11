import { CATEGORIES } from "@/content/categories";
import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { GenericDrillIn } from "@/components/GenericDrillIn";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const about = CATEGORIES.find((c) => c.id === "about");
  return (about?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function AboutItemPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  return (
    <>
      <WaveBackground />
      <Sparkles />
      <GenericDrillIn categoryId="about" slug={slug} metaLabel="ABOUT">
        <ComingSoon />
      </GenericDrillIn>
    </>
  );
}

function ComingSoon() {
  return (
    <section style={{ marginBottom: 36 }}>
      <h3 style={h3}>Coming in v2</h3>
      <p style={para}>
        This page will hold the long-form version. For v1, focus is on the case
        studies — drill into Case Studies on the XMB to see real work.
      </p>
    </section>
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
