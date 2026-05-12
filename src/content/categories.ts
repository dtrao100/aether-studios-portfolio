import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "settings",
    title: "Settings",
    icon: "/icons/Icons.35.png",
    items: [
      { id: "display", title: "Display Settings", subtitle: "Reduced motion, theme", icon: "/icons/Icons.26.png", kind: "setting", href: "/settings/display" },
      { id: "theme", title: "Theme Settings", subtitle: "5 PS3 hues, auto-drift default", icon: "/icons/Icons.36.png", kind: "setting", href: "/settings/theme" },
      { id: "sound", title: "Sound Settings", subtitle: "Authentic PS3 audio, opt-in", icon: "/icons/Icons.34.png", kind: "setting", href: "/settings/sound" },
      { id: "connect", title: "Connect", subtitle: "LinkedIn / Email / GitHub", icon: "/icons/Icons.18.png", kind: "setting", href: "/settings/connect" },
      { id: "about-system", title: "About this System", subtitle: "Credits, attributions, build info", icon: "/icons/Icons.40.png", kind: "setting", href: "/settings/about-system" },
    ],
  },
  {
    id: "about",
    title: "About",
    icon: "/icons/Icons.9.png",
    items: [
      { id: "bio", title: "Bio", subtitle: "Who I am, what I do", icon: "/icons/Icons.9.png", kind: "about-section", href: "/about/bio" },
      { id: "philosophy", title: "Design Philosophy", subtitle: "How I think about the work", icon: "/icons/Icons.40.png", kind: "about-section", href: "/about/philosophy" },
      { id: "contact", title: "Contact", subtitle: "Email, calendar, socials", icon: "/icons/Icons.18.png", kind: "about-section", href: "/about/contact" },
    ],
  },
  {
    id: "case-studies",
    title: "Case Studies",
    icon: "/icons/Icons.8.png",
    items: [
      { id: "complify", title: "Complify", subtitle: "Compliance UX · 2025", meta: "Form 5500 workflows for TPAs", icon: "/icons/Icons.8.png", kind: "case-study", href: "/case-studies/complify", status: "live" },
      { id: "servicenow", title: "ServiceNow", subtitle: "Enterprise · 2024", meta: "Workflow design at scale", icon: "/icons/Icons.8.png", kind: "case-study", href: "/case-studies/servicenow", status: "live" },
      { id: "safetywing", title: "SafetyWing", subtitle: "Insurance · 2023 · write-up in progress", meta: "Nomad-first health coverage", icon: "/icons/Icons.8.png", kind: "case-study", href: "/case-studies/safetywing", status: "coming-soon" },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    icon: "/icons/Icons.36.png",
    items: [
      { id: "aether-gazette", title: "Æther Gazette", subtitle: "Side project", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/aether-gazette", status: "coming-soon" },
      { id: "amazing-digital-library", title: "Amazing Digital Library", subtitle: "Side project", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/amazing-digital-library", status: "coming-soon" },
      { id: "study", title: "Study", subtitle: "Side project", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/study", status: "coming-soon" },
      { id: "digital-mailbox", title: "Digital Mailbox", subtitle: "Side project", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/digital-mailbox", status: "coming-soon" },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "/icons/Icons.40.png",
    items: [
      { id: "post-1", title: "Compliance UX, Part 1", subtitle: "Placeholder", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-1", status: "coming-soon" },
      { id: "post-2", title: "On Authored Interfaces", subtitle: "Placeholder", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-2", status: "coming-soon" },
      { id: "post-3", title: "Building Aether Studios", subtitle: "Placeholder", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-3", status: "coming-soon" },
    ],
  },
  {
    id: "music",
    title: "Music",
    icon: "/icons/Icons.16.png",
    items: [
      { id: "album-1", title: "Album One", subtitle: "Placeholder", icon: "/icons/Icons.16.png", kind: "music", status: "coming-soon" },
      { id: "album-2", title: "Album Two", subtitle: "Placeholder", icon: "/icons/Icons.16.png", kind: "music", status: "coming-soon" },
      { id: "album-3", title: "Album Three", subtitle: "Placeholder", icon: "/icons/Icons.16.png", kind: "music", status: "coming-soon" },
      { id: "album-4", title: "Album Four", subtitle: "Placeholder", icon: "/icons/Icons.16.png", kind: "music", status: "coming-soon" },
      { id: "album-5", title: "Album Five", subtitle: "Placeholder", icon: "/icons/Icons.16.png", kind: "music", status: "coming-soon" },
    ],
  },
  {
    id: "games",
    title: "Games",
    icon: "/icons/Icons.39.png",
    items: [
      { id: "lol", title: "League of Legends", subtitle: "Rengar main", icon: "/icons/Icons.39.png", kind: "game", status: "coming-soon" },
      { id: "game-2", title: "Game Two", subtitle: "Placeholder", icon: "/icons/Icons.39.png", kind: "game", status: "coming-soon" },
      { id: "game-3", title: "Game Three", subtitle: "Placeholder", icon: "/icons/Icons.39.png", kind: "game", status: "coming-soon" },
      { id: "game-4", title: "Game Four", subtitle: "Placeholder", icon: "/icons/Icons.39.png", kind: "game", status: "coming-soon" },
      { id: "game-5", title: "Game Five", subtitle: "Placeholder", icon: "/icons/Icons.39.png", kind: "game", status: "coming-soon" },
    ],
  },
  {
    id: "photos",
    title: "Photos",
    icon: "/icons/Icons.1.png",
    items: [
      { id: "photo-1", title: "Photo One", subtitle: "Placeholder", icon: "/icons/Icons.1.png", kind: "photo", status: "coming-soon" },
      { id: "photo-2", title: "Photo Two", subtitle: "Placeholder", icon: "/icons/Icons.1.png", kind: "photo", status: "coming-soon" },
    ],
  },
];

export const DEFAULT_CATEGORY_INDEX = 2;
