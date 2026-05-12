import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { GenericDrillIn } from "@/components/GenericDrillIn";
import { AudioPlayer } from "@/components/AudioPlayer";

type Params = { slug: string };

const TRACKS: Record<string, { src: string; title: string; notes: string }> = {
  ambient: {
    src: "/audio/bgm.ogg",
    title: "Wave (PS3 OST)",
    notes:
      "The PS3 dashboard's ambient loop, used as background music when the sound toggle is on. Composer credited as Toshiyuki Yoshida / Sony Computer Entertainment.",
  },
};

export async function generateStaticParams(): Promise<Params[]> {
  const music = CATEGORIES.find((c) => c.id === "music");
  return (music?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function MusicPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const track = TRACKS[slug];
  if (!track) notFound();

  return (
    <GenericDrillIn categoryId="music" slug={slug} metaLabel="MUSIC">
      <section style={{ marginBottom: 28 }}>
        <AudioPlayer src={track.src} title={track.title} />
      </section>
      <section style={{ marginBottom: 28 }}>
        <p style={para}>{track.notes}</p>
      </section>
    </GenericDrillIn>
  );
}

const para: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.65,
  margin: "0 0 12px",
  opacity: 0.9,
  fontWeight: 300,
  fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  maxWidth: 680,
};
