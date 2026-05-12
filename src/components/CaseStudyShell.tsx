"use client";

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { SideRail } from "@/components/XMB/SideRail";
import { HUD } from "@/components/XMB/HUD";
import { getCaseStudy } from "@/content/case-studies";
import type { CaseStudy, Snippet } from "@/content/case-studies/types";
import styles from "./CaseStudyShell.module.css";

type CaseStudyShellProps = {
  slug: string;
};

export function CaseStudyShell({ slug }: CaseStudyShellProps) {
  const study = getCaseStudy(slug);
  if (!study) {
    notFound();
  }

  return (
    <div className={styles.layout}>
      <SideRail categoryId="case-studies" activeItemId={slug} />

      <main className={styles.main}>
        <article className={styles.content}>
          <Header study={study} />
          <Snippets snippets={study.snippets} />
          <Stats study={study} />
          <ShortNarrative study={study} />
          <ReadMore study={study} />
          <LoomEmbed study={study} />
          <Footer study={study} />
        </article>
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
      <div className={styles.headerRow}>
        <div className={styles.metaLeft}>
          <div className={styles.client}>{study.client}</div>
          <div className={styles.metaSub}>{study.category}</div>
        </div>
        <div className={styles.metaRight}>
          <div className={styles.role}>{study.role}</div>
          <div className={styles.year}>{study.year}</div>
        </div>
      </div>
      <h1 className={styles.tagline}>{study.tagline}</h1>
    </header>
  );
}

function Snippets({ snippets }: { snippets: Snippet[] }) {
  if (!snippets.length) return null;
  return (
    <div className={styles.snippets}>
      {snippets.map((snippet, i) => (
        <SnippetBlock key={i} snippet={snippet} index={i} />
      ))}
    </div>
  );
}

function SnippetBlock({ snippet, index }: { snippet: Snippet; index: number }) {
  const aspect = snippet.aspect ?? "16 / 9";
  return (
    <figure className={styles.snippet}>
      <div className={styles.snippetMedia} style={{ aspectRatio: aspect }}>
        {snippet.variant === "video" && snippet.src ? (
          <video
            src={snippet.src}
            poster={snippet.poster}
            autoPlay
            muted
            loop
            playsInline
            className={styles.media}
            aria-label={snippet.alt}
          />
        ) : (snippet.variant === "gif" || snippet.variant === "image") && snippet.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={snippet.src} alt={snippet.alt ?? ""} className={styles.media} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIndex}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{snippet.alt ?? "Snippet"}</span>
            <span className={styles.placeholderHint}>2-3s loop lands here</span>
          </div>
        )}
      </div>
      {snippet.caption && <figcaption className={styles.caption}>{snippet.caption}</figcaption>}
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

function ShortNarrative({ study }: { study: CaseStudy }) {
  return <p className={styles.shortNarrative}>{study.shortNarrative}</p>;
}

function ReadMore({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false);
  const hasContent = !!study.longSections?.length || !!study.longNarrative;
  if (!hasContent) return null;
  return (
    <div className={styles.readMore}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.readMoreToggle}
        aria-expanded={open}
      >
        {open ? "Show less ↑" : "Read more ↓"}
      </button>
      {open && (
        <div className={styles.readMoreBody}>
          {study.longSections?.map((section, i) => (
            <section key={i} className={styles.longSection}>
              <h4 className={styles.longHeading}>{section.heading}</h4>
              {section.body && <p className={styles.longBody}>{section.body}</p>}
              {section.bullets && (
                <ul className={styles.longBullets}>
                  {section.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              )}
              {section.quote && (
                <blockquote className={styles.longQuote}>
                  <p>“{section.quote.text}”</p>
                  <cite>{section.quote.attribution}</cite>
                </blockquote>
              )}
            </section>
          ))}
          {!study.longSections && study.longNarrative &&
            study.longNarrative.split(/\n\s*\n/).map((p, i) => (
              <p key={i} className={styles.longBody}>
                {p}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

function LoomEmbed({ study }: { study: CaseStudy }) {
  if (!study.loomUrl) return null;
  const embedUrl = study.loomUrl.replace("/share/", "/embed/").split("?")[0];
  return (
    <section className={styles.loom}>
      <h3 className={styles.sectionHead}>Walkthrough</h3>
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

function Footer({ study }: { study: CaseStudy }) {
  const router = useRouter();
  const hasCollaborators = study.collaborators && study.collaborators.length > 0;
  return (
    <footer className={styles.footer}>
      {hasCollaborators && (
        <div className={styles.collaborators}>
          <h3 className={styles.sectionHead}>Worked with</h3>
          <ul className={styles.collabList}>
            {study.collaborators!.map((c, i) => (
              <li key={i} className={styles.collabItem}>
                <span className={styles.collabRole}>{c.role}</span>
                <span className={styles.collabName}>{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.footerRow}>
        <button
          type="button"
          onClick={() => router.push("/")}
          className={styles.footerLink}
        >
          ← Back to XMB
        </button>
        {study.externalLink && (
          <a
            href={study.externalLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            {study.externalLink.label} ↗
          </a>
        )}
        <a href="mailto:dtrao100@gmail.com" className={styles.footerLink}>
          Contact ↗
        </a>
      </div>
    </footer>
  );
}
