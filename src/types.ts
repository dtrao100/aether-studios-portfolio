export type ItemKind = "case-study" | "project" | "writing" | "music" | "game" | "photo" | "setting" | "about-section";

export type Item = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
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
