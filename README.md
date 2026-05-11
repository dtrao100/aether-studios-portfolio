# Aether Studios — Portfolio (XMB)

A portfolio site for [Aether Studios](https://aether.studio) that recreates the PlayStation 3 Cross Media Bar (XMB) as its navigation metaphor. Built as v1 application material for a Founding Product Designer role at FurtherAI.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**, **Tailwind v4** (CSS-based config)
- **Framer Motion** for category/item sliding
- **WebGL** fragment shader for the wave background (adapted from [fchavonet/creative_coding-xmb_wave_background](https://github.com/fchavonet/creative_coding-xmb_wave_background))
- **MDX** ready for case study content (v1 ships placeholders)

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000 (or 3201 via .claude/launch.json)
npm run build
npm start
```

## Content workflow

All categories and items live in **one file**: [`src/content/categories.ts`](src/content/categories.ts).

To **add a case study**:
1. Add an entry to the `case-studies` category in `categories.ts` with `href: "/case-studies/your-slug"`
2. The route `/case-studies/[slug]` picks it up automatically — the placeholder shell renders title/meta/lede + Problem/Approach/Outcome scaffolding
3. (v2) Drop an MDX file at `src/content/case-studies/<slug>.mdx` and import it from the route

To **change the active default category**: edit `DEFAULT_CATEGORY_INDEX` at the bottom of `categories.ts`.

To **swap icons**: PS3 icons live at `public/icons/Icons.N.png` (59 cherry-picked from the Mr. Billionaire pack). Reference them in `categories.ts` by path.

## Drill-in pattern

Case studies use **Option A — Side Rail**: XMB collapses to a vertical left rail (38% width, sibling case studies stacked, active item glows), case study fills the right pane (62%). Wave continues behind both. `Esc` returns to XMB, `↑/↓` switches siblings without leaving drill-in.

Other categories (Settings, About, Projects, Writing) will follow the same shell. Music / Games / Photos are leaf-content categories.

## Attribution

- **PS3 XMB Icons Pack** by Mr. Billionaire, CC BY-NC-ND 3.0. Icons © Sony Computer Entertainment, used non-commercially. Pack borrowed via [mustafaHTP/ps3-xmb-menu](https://github.com/mustafaHTP/ps3-xmb-menu).
- **SCE-PS3 Rodin Latin font** loaded from `onlinewebfonts.com` CDN. v2 will self-host or AI-recreate the glyphs.
- **Wave shader** adapted from [fchavonet/creative_coding-xmb_wave_background](https://github.com/fchavonet/creative_coding-xmb_wave_background).

## v1 status (scaffold)

- [x] Next.js + TS + Tailwind v4 + Framer Motion
- [x] 8 categories navigable (keyboard + mouse)
- [x] WebGL wave background rendering with `prefers-reduced-motion` support
- [x] Grey theme (gradient body + translucent wave ribbons)
- [x] Case Studies default-selected
- [x] Side-rail drill-in for case studies (Complify / ServiceNow / SafetyWing all wired)
- [x] HUD: clock (top-right), pill-shaped key-hint bar (bottom)
- [ ] Real Complify / ServiceNow / SafetyWing content (MDX)
- [ ] Settings, About, Projects, Writing drill-in pages
- [ ] Vercel deployment

## Deploy

```bash
# After connecting a GitHub remote:
gh repo create aether-studios-portfolio --public --source=. --push
# Then connect on Vercel: https://vercel.com/new
```
