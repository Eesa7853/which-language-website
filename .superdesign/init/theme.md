# Theme

## Part 1 — Compact token summary

Stack: plain HTML/CSS/JS, no framework, no Tailwind, no build step. Theming via CSS custom properties on `:root`, switched by a `data-theme="dark"` attribute on `<html>` (toggled by a header button, persisted to localStorage, defaults to `prefers-color-scheme`).

### Color tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#fbfaf7` (warm off-white) | `#14151c` |
| `--bg-soft` | `#ffffff` | `#1b1d27` |
| `--surface` | `#ffffff` | `#1b1d27` |
| `--surface-hover` | `#f6f4ee` | `#242634` |
| `--border` | `#e7e3d8` | `#2e303f` |
| `--text` | `#201f1c` | `#f1efe9` |
| `--text-dim` | `#57544d` | `#b8b6ad` |
| `--text-faint` | `#6f6a5f` | `#8c8a82` |
| `--accent` | `#3d5af1` (blue) | `#7c96ff` |
| `--accent-strong` | `#2c46d6` | `#5b76f7` |
| `--accent-soft` | `rgba(61,90,241,.08)` | `rgba(124,150,255,.14)` |
| `--accent-gradient` | `linear-gradient(135deg,#4b64f5,#2c46d6)` | `linear-gradient(135deg,#7c96ff,#5b76f7)` |
| `--good` | `#178a5c` | `#3ddc97` |
| `--warn` | `#a3660a` | `#ffb454` |
| `--hard` | `#cc3f3f` | `#ff6b6b` |

### Other tokens
- `--radius: 16px` (card corner radius)
- `--shadow` / `--shadow-lift` / `--shadow-btn` — soft, low-opacity black shadows in light mode; higher-opacity black shadows in dark mode (same offsets)
- `--font-display: "Sora"` (headings — h1-h3, quiz question, result/progress language names, library card names)
- `--font-body: "Inter"` (everything else)
- Google Fonts loaded via `<link>` in `<head>`, weights 400-800

### Notable design decisions already in place
- Rounded pill buttons/badges everywhere (`border-radius: 999px`), 16px rounded cards
- Solid-color (not tinted) difficulty badges: green/amber/red fill with white uppercase text
- A dark "code editor" aesthetic (`#1b1e2b` bg, purple/blue/green syntax-highlight colors) used for the hero illustration AND the per-language syntax example — this is intentionally dark in BOTH site themes, doesn't follow the light/dark toggle
- `//` monospace kicker prefix before most section `<h2>`s (ties to the `</>` logo mark)
- Accent-colored radial gradient blobs behind the hero (blurred circles)
- Sticky, blurred (backdrop-filter) header

## Part 2 — Raw source: full `style.css`

See `C:\Users\Ayesha Nabeel\Desktop\Python-Languages\language-advisor\style.css` (1058 lines) — full file, not duplicated here to keep this doc scannable. Key structural sections in file order: root tokens + dark theme override → reset/base → header/nav/theme-toggle → hero + code-window illustration → buttons/cards (shared primitives) → ask section → assistant/chat → quiz + result → code-checker → progress tracker → library card/compare-panel/tag-filters → footer → responsive breakpoints (860px, 640px).
