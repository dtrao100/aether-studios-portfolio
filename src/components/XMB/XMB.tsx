"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useXMBNav } from "@/hooks/useXMBNav";
import { HUD } from "./HUD";
import styles from "./XMB.module.css";

const CATEGORY_GAP = 170;
const ITEM_GAP = 98;

const spring = { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 };

export function XMB() {
  const { cursor, categories, setCursor, enter } = useXMBNav();

  const activeCategory = categories[cursor.categoryIndex];
  const items = activeCategory?.items ?? [];

  const categoryX = -cursor.categoryIndex * CATEGORY_GAP;
  const itemY = -cursor.itemIndex * ITEM_GAP;

  return (
    <div className={styles.container}>
      {/* horizontal category bar */}
      <div className={styles.categoryViewport}>
        <motion.div
          className={styles.categoryTrack}
          initial={{ x: categoryX }}
          animate={{ x: categoryX }}
          transition={spring}
        >
          {categories.map((cat, i) => {
            const isActive = i === cursor.categoryIndex;
            return (
              <div
                key={cat.id}
                className={`${styles.category} ${isActive ? styles.categoryActive : ""}`}
                onClick={() => setCursor({ categoryIndex: i, itemIndex: 0 })}
              >
                <Image
                  src={cat.icon}
                  alt={cat.title}
                  width={90}
                  height={90}
                  className={styles.categoryIcon}
                  priority={isActive}
                />
                <div className={styles.categoryLabel}>{cat.title}</div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* vertical items column for active category */}
      <div className={styles.itemViewport}>
        <motion.div
          className={styles.itemTrack}
          initial={{ y: itemY }}
          animate={{ y: itemY }}
          transition={spring}
        >
          {items.map((item, i) => {
            const isActive = i === cursor.itemIndex;
            return (
              <div
                key={item.id}
                className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
                onClick={() => {
                  if (isActive) {
                    enter();
                  } else {
                    setCursor({ categoryIndex: cursor.categoryIndex, itemIndex: i });
                  }
                }}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={64}
                  height={64}
                  className={styles.itemIcon}
                />
                <div className={styles.itemBody}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  {item.subtitle && (
                    <div className={styles.itemSubtitle}>{item.subtitle}</div>
                  )}
                </div>
                {item.status === "coming-soon" && (
                  <span className={styles.itemStatus}>Soon</span>
                )}
                {item.status === "disabled" && (
                  <span className={styles.itemStatus}>v2</span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      <HUD />
    </div>
  );
}
