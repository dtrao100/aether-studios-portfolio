import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { SettingsShell } from "@/components/SettingsShell";
import { SoundSettings } from "@/components/SoundSettings";
import { ThemePicker } from "@/components/ThemePicker";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const settings = CATEGORIES.find((c) => c.id === "settings");
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
    <SettingsShell slug={slug}>
      <Content slug={slug} />
    </SettingsShell>
  );
}

function Content({ slug }: { slug: string }) {
  switch (slug) {
    case "display":
      return <Display />;
    case "theme":
      return <ThemePicker />;
    case "sound":
      return <SoundSettings />;
    case "connect":
      return <Connect />;
    default:
      return <Fallback />;
  }
}

function Display() {
  return (
    <>
      <section style={s.section}>
        <h3 style={s.h3}>Reduced motion</h3>
        <p style={s.para}>
          The wave background and sparkle drift respect your system{" "}
          <strong style={s.strong}>prefers-reduced-motion</strong> setting. If
          you&apos;ve set reduce-motion in macOS / iOS / Windows / Android, the
          wave freezes at a static frame and the sparkles dim instead of cycling.
        </p>
        <p style={s.para}>
          A v2 in-app override toggle is on the roadmap. For now the source of
          truth is your OS.
        </p>
      </section>
      <section style={s.section}>
        <h3 style={s.h3}>Density</h3>
        <p style={s.para}>
          Three navigation cadences are supported: keyboard (arrows / WASD),
          mouse (click categories or items), and touch (swipe horizontal for
          categories, vertical for items).
        </p>
        <p style={s.para}>
          Holding a direction key auto-advances after ~320ms and ramps faster
          after 4 ticks. Releasing at a boundary triggers the overscroll
          rubber-band; holding past a category boundary for ~1.6s arms the
          slingshot.
        </p>
      </section>
    </>
  );
}

function Theme() {
  return (
    <>
      <section style={s.section}>
        <h3 style={s.h3}>Theme</h3>
        <p style={s.para}>
          Five PS3-faithful themes are planned. v1 ships with{" "}
          <strong style={s.strong}>Original Gray</strong> only.
        </p>
        <ul style={s.themeList}>
          {THEMES.map((t) => (
            <li
              key={t.id}
              style={{
                ...s.themeItem,
                opacity: t.active ? 1 : 0.35,
              }}
            >
              <span style={{ ...s.swatch, background: t.swatch }} />
              <div style={s.themeBody}>
                <div style={s.themeName}>
                  {t.name}
                  {t.active && <span style={s.activeChip}>Active</span>}
                </div>
                <div style={s.themeNote}>{t.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section style={s.section}>
        <h3 style={s.h3}>Future</h3>
        <p style={s.para}>
          A v2 option will allow the wave tint to drift slowly through the four
          color themes over a 90-second cycle, matching the PS3 dynamic theme
          behavior. Defaults to the active fixed theme.
        </p>
      </section>
    </>
  );
}

function Sound() {
  return (
    <>
      <section style={s.section}>
        <h3 style={s.h3}>Coming in v2</h3>
        <p style={s.para}>
          The PS3 XMB shipped with three sounds I&apos;ll port: the navigation
          tick, the enter chime, and the ambient background loop. v1 ships
          silent so you can read this site at a coffee shop without telling on
          yourself.
        </p>
        <ul style={s.soundList}>
          <li style={s.soundItem}>
            <span style={s.soundName}>Navigation tick</span>
            <span style={s.soundState}>v2</span>
          </li>
          <li style={s.soundItem}>
            <span style={s.soundName}>Enter chime</span>
            <span style={s.soundState}>v2</span>
          </li>
          <li style={s.soundItem}>
            <span style={s.soundName}>Ambient loop</span>
            <span style={s.soundState}>v2</span>
          </li>
          <li style={s.soundItem}>
            <span style={s.soundName}>Master mute</span>
            <span style={s.soundState}>v2</span>
          </li>
        </ul>
      </section>
    </>
  );
}

function Connect() {
  return (
    <>
      <section style={s.section}>
        <p style={s.para}>
          Email is best. Replies in under a business day.
        </p>
        <ul style={s.linkList}>
          <li>
            <a href="mailto:dtrao100@gmail.com" style={s.link}>
              dtrao100@gmail.com ↗
            </a>
            <span style={s.linkNote}>Primary inbox</span>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/danyalrao"
              target="_blank"
              rel="noopener noreferrer"
              style={s.link}
            >
              LinkedIn ↗
            </a>
            <span style={s.linkNote}>Roles, recommendations, connections</span>
          </li>
        </ul>
      </section>
    </>
  );
}

function Fallback() {
  return (
    <section style={s.section}>
      <p style={s.para}>Coming in v2.</p>
    </section>
  );
}

const THEMES = [
  {
    id: "gray",
    name: "Original Gray",
    note: "Default ship. The XMB's neutral, pre-firmware-3 tone.",
    swatch: "linear-gradient(135deg, #6b6b6b, #2a2a2a)",
    active: true,
  },
  {
    id: "blue",
    name: "Launch Blue",
    note: "The PS3 launch theme. Deep, cinematic, signals consumer-grade.",
    swatch: "linear-gradient(135deg, #2b4cc8, #0d2270)",
    active: false,
  },
  {
    id: "indigo",
    name: "Indigo",
    note: "Twilight register. The wave reads warmer at low brightness.",
    swatch: "linear-gradient(135deg, #6b48b9, #2d1e6a)",
    active: false,
  },
  {
    id: "navy",
    name: "Deep Navy",
    note: "Most muted of the colored themes. Closest cousin to Gray.",
    swatch: "linear-gradient(135deg, #2e4894, #0a1640)",
    active: false,
  },
  {
    id: "warm",
    name: "Warm Gray",
    note: "Slight ochre cast. Reads as desk-lamp light at 11pm.",
    swatch: "linear-gradient(135deg, #9e8f7e, #3c3024)",
    active: false,
  },
];

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 32 },
  h3: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.55,
    margin: "0 0 14px",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: 600,
  },
  para: {
    fontSize: 17,
    lineHeight: 1.65,
    margin: "0 0 18px",
    opacity: 0.88,
    fontWeight: 300,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 680,
  },
  strong: { color: "white", opacity: 1, fontWeight: 500 },
  themeList: { listStyle: "none", padding: 0, margin: "0 0 12px", display: "flex", flexDirection: "column", gap: 10 },
  themeItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "10px 14px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
  },
  swatch: { width: 48, height: 32, borderRadius: 4, flexShrink: 0 },
  themeBody: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  themeName: {
    fontSize: 15,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  themeNote: {
    fontSize: 12,
    opacity: 0.65,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  activeChip: {
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "2px 7px",
    borderRadius: 3,
    background: "rgba(116, 232, 157, 0.18)",
    color: "rgb(116, 232, 157)",
    border: "1px solid rgba(116, 232, 157, 0.4)",
  },
  soundList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 },
  soundItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 14px",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 5,
    opacity: 0.55,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  soundName: { fontSize: 14 },
  soundState: { fontSize: 10, letterSpacing: 1, textTransform: "uppercase", opacity: 0.7 },
  linkList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 },
  link: {
    fontSize: 17,
    color: "white",
    textDecoration: "none",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    paddingBottom: 2,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    display: "inline-block",
  },
  linkNote: {
    display: "block",
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
};
