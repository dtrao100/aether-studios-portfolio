"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useXMBNav } from "@/hooks/useXMBNav";
import { HUD } from "./HUD";
import styles from "./XMB.module.css";

const CATEGORY_GAP = 170;
const ITEM_GAP = 98;
const OVERSCROLL_PX = 18; // how far the track stretches when pushed past a boundary

const spring = { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 };
const bounceSpring = { type: "spring" as const, stiffness: 360, damping: 22, mass: 0.7 };

export function XMB() {
  const { cursor, categories, setCursor, enter, overscroll } = useXMBNav();

  const activeCategory = categories[cursor.categoryIndex];
  const items = activeCategory?.items ?? [];

  const overscrollH = overscroll?.axis === "h" ? -overscroll.dir * OVERSCROLL_PX : 0;
  const overscrollV = overscroll?.axis === "v" ? -overscroll.dir * OVERSCROLL_PX : 0;

  const categoryX = -cursor.categoryIndex * CATEGORY_GAP + overscrollH;
  const itemY = -cursor.itemIndex * ITEM_GAP + overscrollV;

  return (
    <div className={styles.container}>
      {/* horizontal category bar */}
      <div className={styles.categoryViewport}>
        <motion.div
          className={styles.categoryTrack}
          initial={{ x: -cursor.categoryIndex * CATEGORY_GAP }}
          animate={{ x: categoryX }}
          transition={overscroll?.axis === "h" ? bounceSpring : spring}
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

      {/* vertical items column — items pass through/above the category bar with a soft fade */}
      <div className={styles.itemViewport}>
        <motion.div
          className={styles.itemTrack}
          initial={{ y: -cursor.itemIndex * ITEM_GAP }}
          animate={{ y: itemY }}
          transition={overscroll?.axis === "v" ? bounceSpring : spring}
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
