import { CATEGORIES } from "@/content/categories";
import { GenericDrillIn } from "@/components/GenericDrillIn";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const about = CATEGORIES.find((c) => c.id === "about");
  return (about?.items ?? []).map((i) => ({ slug: i.id }));
}

export default async function AboutItemPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  return (
    <GenericDrillIn categoryId="about" slug={slug} metaLabel="ABOUT">
      <Content slug={slug} />
    </GenericDrillIn>
  );
}

function Content({ slug }: { slug: string }) {
  switch (slug) {
    case "bio":
      return <Bio />;
    case "philosophy":
      return <Philosophy />;
    case "contact":
      return <Contact />;
    default:
      return <ComingSoon />;
  }
}

function Bio() {
  return (
    <section style={s.section}>
      <p style={s.para}>
        I&apos;m Danny. Product designer based in the San Francisco Bay Area.
      </p>
      <p style={s.para}>
        I work end to end in regulated B2B SaaS, compliance UX at{" "}
        <strong style={s.strong}>Complify</strong>, enterprise workflow tools at{" "}
        <strong style={s.strong}>ServiceNow</strong>, nomad health insurance at{" "}
        <strong style={s.strong}>SafetyWing</strong>. The common thread is taking
        complex regulator-shaped workflows and translating them into something the
        person actually doing the work wants to use.
      </p>
      <p style={s.para}>
        In 2025 I founded{" "}
        <strong style={s.strong}>Aether Studios</strong>, a solo design studio
        for early-stage B2B startups, working AI-native (Claude Code, Cursor,
        Figma). I ship polished interfaces and interactive prototypes at the
        speed of a small product team.
      </p>
      <p style={s.para}>
        Before that, I studied Human-Computer Interaction and Design at UCSD,
        with a minor in Computer Science. I worked under{" "}
        <strong style={s.strong}>Don Norman</strong> at the UCSD Design Lab on
        user-centered research projects in healthcare.
      </p>
    </section>
  );
}

function Philosophy() {
  return (
    <section style={s.section}>
      <h3 style={s.h3}>The work, three rules</h3>
      <ol style={s.list}>
        <li style={s.li}>
          <strong style={s.strong}>Translate the regulator&apos;s language into the user&apos;s.</strong>{" "}
          The hardest part of compliance UX is deciding which regulator vocabulary to keep and which to rewrite. A User Access Review is a real auditor concept; the screen showing it does not need to use the auditor&apos;s words for every field.
        </li>
        <li style={s.li}>
          <strong style={s.strong}>Ship the system, not the screen.</strong> Every
          engagement leaves the team a reusable component library and a decision
          log. The mockup gets handed off in a sprint. The system keeps paying for itself.
        </li>
        <li style={s.li}>
          <strong style={s.strong}>Sequential beats configurable.</strong> If users
          have to think about how to set up the tool, the tool failed. Wizard the
          first run; configure on demand. Auditors don&apos;t think in nodes.
        </li>
      </ol>
      <h3 style={{ ...s.h3, marginTop: 28 }}>How I work</h3>
      <p style={s.para}>
        Async-first. I document decisions as they&apos;re made so the team has
        context I don&apos;t have to be present to share. Show working prototypes,
        not Figma jpegs, whenever possible. AI-native (Claude Code, Cursor,
        Figma) so research-to-prototype cycles compress from days to hours.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section style={s.section}>
      <p style={s.para}>
        Best way to reach me is email. I respond within a business day.
      </p>
      <ul style={s.linkList}>
        <li><a href="mailto:dtrao100@gmail.com" style={s.link}>dtrao100@gmail.com ↗</a></li>
        <li><a href="https://linkedin.com/in/danyalrao" target="_blank" rel="noopener noreferrer" style={s.link}>LinkedIn ↗</a></li>
      </ul>
      <p style={{ ...s.para, marginTop: 24, opacity: 0.65 }}>
        Based in the San Francisco Bay Area. Available for both contract and
        full-time roles.
      </p>
    </section>
  );
}

function ComingSoon() {
  return (
    <section style={s.section}>
      <p style={s.para}>Coming in v2.</p>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: { marginBottom: 36 },
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
    opacity: 0.9,
    fontWeight: 300,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 680,
  },
  list: {
    margin: "0 0 18px",
    paddingLeft: 24,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  li: {
    fontSize: 16,
    lineHeight: 1.6,
    marginBottom: 14,
    opacity: 0.92,
    fontWeight: 300,
    maxWidth: 680,
  },
  strong: { color: "white", opacity: 1, fontWeight: 500 },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 12px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  link: {
    fontSize: 17,
    color: "white",
    textDecoration: "none",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    paddingBottom: 2,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
};
