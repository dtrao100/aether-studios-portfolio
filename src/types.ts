export type ItemKind = "case-study" | "project" | "writing" | "music" | "setting" | "about-section";

export type Item = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  /** Short blurb that reveals next to the item when it is active. */
  description?: string;
  icon: string;
  kind: ItemKind;
  href?: string;
  status?: "live" | "coming-soon" | "disabled";
};

export type Category = {
  id: string;
  title: string;
  icon: string;
  items: Item[];
};

export type CursorState = {
  categoryIndex: number;
  itemIndex: number;
};

export type XMBMode = "xmb" | "drillIn";
