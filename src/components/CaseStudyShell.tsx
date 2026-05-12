import { notFound } from "next/navigation";
import { SideRail } from "@/components/XMB/SideRail";
import { HUD } from "@/components/XMB/HUD";
import { getCaseStudy } from "@/content/case-studies";
import type { CaseStudy } from "@/content/case-studies";
import styles from "./CaseStudyShell.module.css";

type CaseStudyShellProps = {
  slug: string;
};

export function CaseStudyShell({ slug }: CaseStudyShellProps) {
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <div className={styles.layout}>
      <SideRail categoryId="case-studies" activeItemId={slug} />

      <main className={styles.main}>
        <div className={styles.content}>
          <Header study={study} />
          <Hero study={study} />
          <Stats study={study} />
          <Narrative study={study} />
          <LoomEmbed study={study} />
          <ExternalCta study={study} />
        </div>
      </main>

      <HUD
        hints={
          <>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Sibling · <kbd>Esc</kbd> Back to XMB
          </>
        }
      />
    </div>
  );
}

function Header({ study }: { study: CaseStudy }) {
  return (
    <header className={styles.header}>
      <div className={styles.meta}>
        {study.category} · {study.year} · {study.role}
      </div>
      <h1 className={styles.title}>{study.title}</h1>
      <p className={styles.lede}>{study.tagline}</p>
    </header>
  );
}

function Hero({ study }: { study: CaseStudy }) {
  if (study.heroVariant === "video" && study.heroSrc) {
    return (
      <figure className={styles.hero}>
        <video
          src={study.heroSrc}
          poster={study.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          className={styles.heroMedia}
          aria-label={study.heroAlt}
        />
      </figure>
    );
  }
  if ((study.heroVariant === "gif" || study.heroVariant === "image") && study.heroSrc) {
    return (
      <figure className={styles.hero}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={study.heroSrc}
          alt={study.heroAlt ?? ""}
          className={styles.heroMedia}
        />
      </figure>
    );
  }
  // placeholder
  return (
    <figure className={`${styles.hero} ${styles.heroPlaceholder}`}>
      <span>{study.heroAlt ?? "HERO IMAGE"}</span>
      <span className={styles.heroPlaceholderHint}>
        teaser GIF or video lands here
      </span>
    </figure>
  );
}

function Stats({ study }: { study: CaseStudy }) {
  if (!study.stats || study.stats.length === 0) return null;
  return (
    <ul className={styles.stats}>
      {study.stats.map((s, i) => (
        <li key={i} className={styles.stat}>
          <span className={styles.statValue}>{s.value}</span>
          <span className={styles.statLabel}>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Narrative({ study }: { study: CaseStudy }) {
  return (
    <div className={styles.narrative}>
      <section className={styles.section}>
        <h3>Problem</h3>
        <p>{study.problem}</p>
      </section>
      <section className={styles.section}>
        <h3>Approach</h3>
        <p>{study.approach}</p>
      </section>
      <section className={styles.section}>
        <h3>Outcome</h3>
        <p>{study.outcome}</p>
      </section>
    </div>
  );
}

function LoomEmbed({ study }: { study: CaseStudy }) {
  if (!study.loomUrl) return null;
  // Loom share URLs end in /share/ID; embed URL uses /embed/ID
  const embedUrl = study.loomUrl
    .replace("/share/", "/embed/")
    .split("?")[0];
  return (
    <section className={styles.loom}>
      <h3 className={styles.loomHead}>Walkthrough</h3>
      <div className={styles.loomFrame}>
        <iframe
          src={embedUrl}
          allow="fullscreen"
          allowFullScreen
          title={`${study.title} walkthrough`}
        />
      </div>
    </section>
  );
}

function ExternalCta({ study }: { study: CaseStudy }) {
  if (!study.externalLink) return null;
  return (
    <a
      href={study.externalLink.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.cta}
    >
      {study.externalLink.label} ↗
    </a>
  );
}
