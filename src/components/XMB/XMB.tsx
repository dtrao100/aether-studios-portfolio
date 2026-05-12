"use client";

import Image from "next/image";
import { useXMBNav } from "@/hooks/useXMBNav";
import { HUD } from "./HUD";
import styles from "./XMB.module.css";

const CATEGORY_GAP = 170;
const ITEM_GAP = 98;

const PULL_OFFSET_H = 36;
const CHARGE_OFFSET_H = 90;
const PULL_OFFSET_V = 18;

const REST_TRANSITION = "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1)";
const PULL_TRANSITION = "transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1)";
const CHARGE_TRANSITION = "transform 1300ms cubic-bezier(0.55, 0, 0.45, 1)";
const ARMED_TRANSITION = "transform 0ms"; // CSS tremble takes over
const SLINGSHOT_TRANSITION =
  "transform 950ms cubic-bezier(0.16, 0.88, 0.32, 1.18)"; // overshoot-y curve

export function XMB() {
  const { cursor, categories, setCursor, enter, overscroll } = useXMBNav();

  const activeCategory = categories[cursor.categoryIndex];
  const items = activeCategory?.items ?? [];

  // overscroll offsets per axis from phase
  let overscrollH = 0;
  let overscrollV = 0;
  if (overscroll?.axis === "h") {
    if (overscroll.phase === "pull") overscrollH = -overscroll.dir * PULL_OFFSET_H;
    else if (overscroll.phase === "charge" || overscroll.phase === "armed") {
      overscrollH = -overscroll.dir * CHARGE_OFFSET_H;
    }
    // slingshot: cursor has jumped; no offset
  } else if (overscroll?.axis === "v" && overscroll.phase === "pull") {
    overscrollV = -overscroll.dir * PULL_OFFSET_V;
  }

  const categoryX = -cursor.categoryIndex * CATEGORY_GAP + overscrollH;
  const itemY = -cursor.itemIndex * ITEM_GAP + overscrollV;

  // pick CSS transition string per phase
  let categoryTransition = REST_TRANSITION;
  if (overscroll?.axis === "h") {
    if (overscroll.phase === "pull") categoryTransition = PULL_TRANSITION;
    else if (overscroll.phase === "charge") categoryTransition = CHARGE_TRANSITION;
    else if (overscroll.phase === "armed") categoryTransition = ARMED_TRANSITION;
    else if (overscroll.phase === "slingshot") categoryTransition = SLINGSHOT_TRANSITION;
  }

  let itemTransition = REST_TRANSITION;
  if (overscroll?.axis === "v" && overscroll.phase === "pull") {
    itemTransition = PULL_TRANSITION;
  }

  // CSS phase classes (horizontal only)
  const horizontalPhaseClass =
    overscroll?.axis === "h" && (overscroll.phase === "charge" || overscroll.phase === "armed")
      ? styles.charging
      : "";
  const armedClass =
    overscroll?.axis === "h" && overscroll.phase === "armed" ? styles.armed : "";

  const categoryTrackClass = [styles.categoryTrack, horizontalPhaseClass, armedClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.container}>
      {/* horizontal category bar */}
      <div className={styles.categoryViewport}>
        <div
          className={categoryTrackClass}
          style={{
            transform: `translateX(${categoryX}px)`,
            transition: categoryTransition,
          }}
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
        </div>
      </div>

      {/* vertical items column */}
      <div className={styles.itemViewport}>
        <div
          className={styles.itemTrack}
          style={{
            transform: `translateY(${itemY}px)`,
            transition: itemTransition,
          }}
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
        </div>
      </div>

      <HUD />
    </div>
  );
}
