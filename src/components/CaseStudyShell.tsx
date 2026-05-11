import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { SideRail } from "@/components/XMB/SideRail";
import { HUD } from "@/components/XMB/HUD";
import styles from "./CaseStudyShell.module.css";

type CaseStudyShellProps = {
  slug: string;
  children?: React.ReactNode;
};

export function CaseStudyShell({ slug, children }: CaseStudyShellProps) {
  const category = CATEGORIES.find((c) => c.id === "case-studies");
  const item = category?.items.find((i) => i.id === slug);
  if (!category || !item) notFound();

  return (
    <div className={styles.layout}>
      <SideRail categoryId="case-studies" activeItemId={slug} />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.meta}>{item.subtitle}</div>
          <h1 className={styles.title}>{item.title}</h1>
          {item.meta && <p className={styles.lede}>{item.meta}</p>}

          <div className={styles.hero} role="img" aria-label="Case study hero image placeholder">
            <span>HERO IMAGE</span>
          </div>

          {children ?? (
            <>
              <section className={styles.section}>
                <h3>Problem</h3>
                <p>
                  Placeholder. The case study content for{" "}
                  <strong>{item.title}</strong> will live here. This file is wired
                  but the long-form content has not been written yet. Replace this
                  placeholder with MDX content once the v1 scaffold is approved.
                </p>
              </section>
              <section className={styles.section}>
                <h3>Approach</h3>
                <p>Placeholder approach section.</p>
              </section>
              <section className={styles.section}>
                <h3>Outcome</h3>
                <p>Placeholder outcome section.</p>
              </section>
            </>
          )}
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
