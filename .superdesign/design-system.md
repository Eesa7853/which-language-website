# Design System — "Which Language?"

## Product context
A free, no-signup static website (plain HTML/CSS/JS, no framework) that helps someone pick a programming language to learn. Key features: a hero with a clickable multi-language code demo, a free-text instant matcher, a 4-question quiz, an AI chat assistant (Gemini, BYOK), a photo-based code checker (Claude, BYOK), a progress tracker, and a 23-language library with search/filter/compare. Single page, anchor-navigated sections. Tone: direct, honest, a little playful (e.g. "it depends ✨" in the code demo, "No language is truly wrong" in the footer) — not corporate.

## Color palette
Light theme (default) and dark theme (toggle in header, follows OS preference by default), both via CSS custom properties.

| Token | Light | Dark |
|---|---|---|
| Background | `#fbfaf7` | `#14151c` |
| Surface / card | `#ffffff` | `#1b1d27` |
| Surface hover | `#f6f4ee` | `#242634` |
| Border | `#e7e3d8` | `#2e303f` |
| Text | `#201f1c` | `#f1efe9` |
| Text (dim) | `#57544d` | `#b8b6ad` |
| Text (faint) | `#6f6a5f` | `#8c8a82` |
| Accent (blue) | `#3d5af1` | `#7c96ff` |
| Accent strong | `#2c46d6` | `#5b76f7` |
| Success/Beginner | `#178a5c` | `#3ddc97` |
| Warn/Moderate | `#a3660a` | `#ffb454` |
| Danger/Steep | `#cc3f3f` | `#ff6b6b` |

Accent gradient (primary buttons, active states): `linear-gradient(135deg, accent-strong → accent-strong)`.

## Typography
- Display/headings: **Sora** (600/700/800 weight) — h1-h3, quiz question text, result/progress language names, library card names
- Body: **Inter** (400/500/600/700 weight) — everything else
- Code/monospace: system monospace stack (`ui-monospace, SFMono-Regular, Menlo, monospace`) — used for the brand mark, code windows, and syntax examples

## Spacing & shape
- Card radius: 16px (`--radius`)
- Buttons/pills/badges: fully rounded (`999px`)
- Small elements (inputs, resource links): 10px radius
- Consistent `.wrap` content container: `max-width: 1080px`, `24px` side padding

## Shadows
Soft, low-opacity black shadows (light: ~6-11% opacity; dark: ~35-45% opacity), three tiers: `--shadow` (resting), `--shadow-lift` (hover), `--shadow-btn` (accent-tinted, on primary buttons).

## Signature visual motifs (keep these — they're the brand)
1. **Dark code-editor aesthetic** for the hero illustration and every language card's syntax example — macOS traffic-light dots, monospace, purple/blue/green syntax highlighting (`#c792ea` keywords, `#82aaff` functions, `#a5e3a5` strings). This stays dark regardless of site theme.
2. **`// ` monospace kicker** before section headings, echoing the `</>` brand mark.
3. **Solid-fill status pills** (not tinted/soft) for difficulty ratings — green/amber/red with white uppercase text.
4. Radial gradient blur "blobs" behind the hero for depth without a busy background.
5. Micro-interactions: cards lift + shadow grow on hover, buttons translate up 1px, nav links get an animated underline, quiz options slide right slightly on hover.

## Motion
Fast, subtle transitions (0.12-0.2s ease) on hover/focus states. A 0.45s fade-in on page load. No large/slow animations — the product is information-dense and utilitarian, not a marketing showcase.

## What NOT to introduce
- No serif or decorative display fonts — Sora + Inter only
- No colors outside the palette above (no pink/purple/neon gradients)
- No sharp corners on interactive elements (buttons/pills stay fully rounded)
- Do not make the code-editor blocks follow the light/dark toggle — they're intentionally always-dark
