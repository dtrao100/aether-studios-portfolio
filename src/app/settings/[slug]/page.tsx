import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { SettingsShell } from "@/components/SettingsShell";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const settings = CATEGORIES.find((c) => c.id === "settings");
  // exclude about-system since it has its own route
  return (settings?.items ?? [])
    .filter((i) => i.id !== "about-system")
    .map((i) => ({ slug: i.id }));
}

export default async function SettingsItemPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const settings = CATEGORIES.find((c) => c.id === "settings");
  const item = settings?.items.find((i) => i.id === slug);
  if (!item) notFound();

  return (
    <>
      <WaveBackground />
      <Sparkles />
      <SettingsShell slug={slug}>
        <section style={{ marginBottom: 36 }}>
          <h3 style={h3}>Coming in v2</h3>
          <p style={para}>
            This settings panel will be wired up in a future iteration. For now,{" "}
            <strong style={strong}>{item.title}</strong> is a placeholder.
          </p>
          <p style={para}>
            Browse to <strong style={strong}>About this System</strong> in the rail
            for credits, attribution, and the philosophy behind this portfolio.
          </p>
        </section>
      </SettingsShell>
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
