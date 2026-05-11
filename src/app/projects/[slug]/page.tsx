import { CATEGORIES } from "@/content/categories";
import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { GenericDrillIn } from "@/components/GenericDrillIn";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const projects = CATEGORIES.find((c) => c.id === "projects");
  return (projects?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function ProjectPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  return (
    <>
      <WaveBackground />
      <Sparkles />
      <GenericDrillIn categoryId="projects" slug={slug} metaLabel="SIDE PROJECT">
        <section style={{ marginBottom: 36 }}>
          <h3 style={h3}>Coming soon</h3>
          <p style={para}>
            Detail page for this project is in progress. v1 focuses on the case
            studies under <strong style={strong}>Case Studies</strong>.
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
const strong: React.CSSProperties = {
  color: "white",
  opacity: 1,
  fontWeight: 500,
};
