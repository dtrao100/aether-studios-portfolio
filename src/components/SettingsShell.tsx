import { notFound } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import { SideRail } from "@/components/XMB/SideRail";
import { HUD } from "@/components/XMB/HUD";
import styles from "./CaseStudyShell.module.css";

type SettingsShellProps = {
  slug: string;
  children: React.ReactNode;
};

export function SettingsShell({ slug, children }: SettingsShellProps) {
  const category = CATEGORIES.find((c) => c.id === "settings");
  const item = category?.items.find((i) => i.id === slug);
  if (!category || !item) notFound();

  return (
    <div className={styles.layout}>
      <SideRail categoryId="settings" activeItemId={slug} />

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.meta}>SETTINGS</div>
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
