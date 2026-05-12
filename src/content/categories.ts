import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "settings",
    title: "Settings",
    icon: "/icons/Icons.35.png",
    items: [
      { id: "theme", title: "Theme Settings", subtitle: "5 PS3 hues, auto-drift default", description: "Click a theme to apply instantly. Auto drift cycles through all five every 3 minutes.", icon: "/icons/Icons.36.png", kind: "setting", href: "/settings/theme" },
      { id: "sound", title: "Sound Settings", subtitle: "Authentic PS3 audio, opt-in", description: "Real PS3 system sounds, sourced from OSGameWare. Off by default. BGM and FX toggle independently.", icon: "/icons/Icons.34.png", kind: "setting", href: "/settings/sound" },
      { id: "display", title: "Display Settings", subtitle: "Reduced motion", description: "Respect prefers-reduced-motion. Wave freezes, transitions cut to instant.", icon: "/icons/Icons.26.png", kind: "setting", href: "/settings/display" },
      { id: "connect", title: "Connect", subtitle: "Email / LinkedIn", description: "Quick links to reach out.", icon: "/icons/Icons.18.png", kind: "setting", href: "/settings/connect" },
      { id: "about-system", title: "About this System", subtitle: "Credits, attributions, build info", description: "Tech stack, asset sources, and the story behind this PS3 XMB tribute.", icon: "/icons/Icons.40.png", kind: "setting", href: "/settings/about-system" },
    ],
  },
  {
    id: "about",
    title: "About",
    icon: "/icons/Icons.9.png",
    items: [
      { id: "bio", title: "Bio", subtitle: "Who I am, what I do", description: "Product designer in the Bay Area. Compliance UX at Complify, enterprise workflows at ServiceNow, nomad health at SafetyWing. UCSD HCI grad.", icon: "/icons/Icons.9.png", kind: "about-section", href: "/about/bio" },
      { id: "philosophy", title: "Design Philosophy", subtitle: "How I think about the work", description: "Three rules: translate the regulator's language, ship the system not the screen, sequential beats configurable.", icon: "/icons/Icons.40.png", kind: "about-section", href: "/about/philosophy" },
      { id: "contact", title: "Contact", subtitle: "Email, calendar, socials", description: "Best reached by email. Responds within a business day. Available for contract and full-time.", icon: "/icons/Icons.18.png", kind: "about-section", href: "/about/contact" },
    ],
  },
  {
    id: "case-studies",
    title: "Case Studies",
    icon: "/icons/Icons.8.png",
    items: [
      { id: "servicenow", title: "ServiceNow", subtitle: "Enterprise", meta: "Workflow design at scale", description: "Workflow patterns for enterprise teams managing complex approvals. Component-driven design at platform scale.", icon: "/icons/Icons.8.png", kind: "case-study", href: "/case-studies/servicenow", status: "live" },
      { id: "complify", title: "Complify", subtitle: "Startup", meta: "User Access Reviews for audit firms", description: "Redesigned the end-to-end UAR workflow from blank state to completed review. Solo product designer on a tight scope-to-ship cycle.", icon: "/icons/Icons.8.png", kind: "case-study", href: "/case-studies/complify", status: "live" },
      { id: "safetywing", title: "SafetyWing", subtitle: "Insurance · locked", meta: "Nomad-first health coverage", description: "Health insurance UX for digital nomads. Write-up not yet available.", icon: "/icons/Icons.8.png", kind: "case-study", status: "disabled" },
    ],
  },
  {
    id: "projects",
    title: "Projects",
    icon: "/icons/Icons.36.png",
    items: [
      { id: "aether-gazette", title: "Æther Gazette", subtitle: "Publication", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/aether-gazette", status: "live" },
      { id: "amazing-digital-library", title: "Amazing Digital Library", subtitle: "Reference index", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/amazing-digital-library", status: "live" },
      { id: "study", title: "Study", subtitle: "Spaced repetition for designers", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/study", status: "live" },
      { id: "digital-mailbox", title: "Digital Mailbox", subtitle: "Inbox-shaped reader", icon: "/icons/Icons.40.png", kind: "project", href: "/projects/digital-mailbox", status: "live" },
    ],
  },
  {
    id: "writing",
    title: "Writing",
    icon: "/icons/Icons.40.png",
    items: [
      { id: "post-1", title: "Compliance UX, Part 1", subtitle: "Draft in progress", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-1", status: "coming-soon" },
      { id: "post-2", title: "On Authored Interfaces", subtitle: "Draft in progress", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-2", status: "coming-soon" },
      { id: "post-3", title: "Building Aether Studios", subtitle: "Draft in progress", icon: "/icons/Icons.40.png", kind: "writing", href: "/writing/post-3", status: "coming-soon" },
    ],
  },
  {
    id: "music",
    title: "Music",
    icon: "/icons/Icons.16.png",
    items: [
      { id: "ambient", title: "Wave (PS3 OST)", subtitle: "Ambient", icon: "/icons/Icons.16.png", kind: "music", href: "/music/ambient", status: "live" },
    ],
  },
];

export const DEFAULT_CATEGORY_INDEX = 2;
