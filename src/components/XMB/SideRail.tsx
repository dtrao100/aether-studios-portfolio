"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/content/categories";
import type { Category, Item } from "@/types";
import { play as playSound } from "@/lib/sound";
import styles from "./SideRail.module.css";

type SideRailProps = {
  categoryId: string;
  activeItemId: string;
};

export function SideRail({ categoryId, activeItemId }: SideRailProps) {
  const router = useRouter();
  const category: Category | undefined = CATEGORIES.find((c) => c.id === categoryId);
  const items: Item[] = category?.items ?? [];
  const activeIndex = items.findIndex((i) => i.id === activeItemId);

  const goToItem = useCallback(
    (delta: number) => {
      if (activeIndex < 0) return;
      const next = items[activeIndex + delta];
      if (next?.href && next.status !== "disabled") {
        router.push(next.href);
      }
    },
    [activeIndex, items, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        playSound("cancel");
        router.push("/");
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        playSound("navUp");
        goToItem(-1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        playSound("navDown");
        goToItem(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, goToItem]);

  if (!category) return null;

  return (
    <aside className={styles.rail}>
      <Link href="/" className={styles.back}>
        ↩ XMB
      </Link>

      <div className={styles.categoryHead}>
        <Image src={category.icon} alt="" width={44} height={44} />
        <span>{category.title}</span>
      </div>

      <nav className={styles.items}>
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          if (!item.href || item.status === "disabled") {
            return (
              <div
                key={item.id}
                className={`${styles.item} ${styles.itemDisabled}`}
                aria-disabled
              >
                <div className={styles.itemTitle}>{item.title}</div>
                {item.subtitle && (
                  <div className={styles.itemSubtitle}>{item.subtitle}</div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
            >
              <div className={styles.itemTitle}>{item.title}</div>
              {item.subtitle && (
                <div className={styles.itemSubtitle}>{item.subtitle}</div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
