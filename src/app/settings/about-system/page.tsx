import { WaveBackground } from "@/components/WaveBackground";
import { Sparkles } from "@/components/Sparkles";
import { SettingsShell } from "@/components/SettingsShell";

export default function AboutSystemPage() {
  return (
    <>
      <WaveBackground />
      <Sparkles />
      <SettingsShell slug="about-system">
        <section style={{ marginBottom: 36 }}>
          <h3 style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.55,
            margin: "0 0 14px",
            fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 600,
          }}>Why this?</h3>
          <p style={para}>
            This portfolio is a faithful recreation of the PlayStation 3 Cross Media Bar
            (XMB), built as the navigation shell for Aether Studios — Danny Tran&apos;s
            solo B2B product design consultancy specializing in compliance UX for
            regulated industries.
          </p>
          <p style={para}>
            The choice is deliberate. The current AI-Figma-flat default has become
            visual noise in the design portfolio space; recreating an authored,
            opinionated UI from a different era signals craft, taste, and the kind of
            attention to detail that doesn&apos;t come from a template. The PS3 XMB in
            particular embodies a specific kind of restraint — slow ambient motion,
            generous spacing, a single bold typeface — that mirrors the design
            philosophy applied to Aether Studios client work.
          </p>
          <p style={para}>
            v1 ships with three real case studies (Complify, ServiceNow, SafetyWing).
            Future work: real audio, boot sequence, additional theme variants, and
            screen-recorded teaser GIFs for each case study.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h3 style={h3}>Credits & Attribution</h3>
          <p style={para}>
            <strong style={strong}>PS3 XMB Icons Pack</strong> by Mr. Billionaire, used
            under CC BY-NC-ND 3.0. Icons © Sony Computer Entertainment. Used
            non-commercially — this is a personal portfolio, not a commercial product.
          </p>
          <p style={para}>
            <strong style={strong}>SCE-PS3 Rodin Latin</strong> font loaded via
            onlinewebfonts.com. A future v2 may self-host or recreate the glyphs.
          </p>
          <p style={para}>
            <strong style={strong}>Wave background shader</strong> adapted from
            fchavonet&apos;s creative-coding GLSL wave (MIT). Reference repos for the
            navigation pattern: mustafaHTP/ps3-xmb-menu, menonparik/xmb-on-web,
            glitch128/PS3-Simulator.
          </p>
        </section>

        <section style={{ marginBottom: 36 }}>
          <h3 style={h3}>Build Info</h3>
          <p style={para}>
            <strong style={strong}>v1.0.0</strong> — May 2026.<br />
            Next.js 16 · TypeScript · Tailwind v4 · Framer Motion · raw WebGL shader.
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
