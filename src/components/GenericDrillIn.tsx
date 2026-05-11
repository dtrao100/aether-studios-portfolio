import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { SideRail } from "@/components/XMB/SideRail";
import { HUD } from "@/components/XMB/HUD";
import styles from "./CaseStudyShell.module.css";

type GenericDrillInProps = {
  categoryId: string;
  slug: string;
  metaLabel: string;
  children: React.ReactNode;
};

export function GenericDrillIn({ categoryId, slug, metaLabel, children }: GenericDrillInProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const item = category?.items.find((i) => i.id === slug);
  if (!category || !item) notFound();

  return (
    <div className={styles.layout}>
      <SideRail categoryId={categoryId} activeItemId={slug} />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.meta}>{metaLabel}</div>
          <h1 className={styles.title}>{item.title}</h1>
          {item.subtitle && <p className={styles.lede}>{item.subtitle}</p>}
          {children}
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
