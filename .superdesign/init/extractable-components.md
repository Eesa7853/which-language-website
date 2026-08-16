# Extractable Components

## Layout Components (appear on every page — there's only one page, but these repeat conceptually)
- **SiteHeader** — Source: `index.html` `.site-header` + `style.css`. Sticky, blurred header with brand mark, anchor nav, dark-mode toggle. Extractable props: none really needed (static nav links) — the only dynamic bit is the theme-toggle icon (🌙/☀️), driven by JS not props.
- **SiteFooter** — Source: `index.html` `.site-footer`. Static, single paragraph.
- **HeroCodeWindow** — Source: `index.html` `.code-window` + `.code-window-pills`, data in `script.js` `HERO_SNIPPETS`. Extractable props: `activeLang` (string, default "python"), `fileName`, `codeHtml`.

## Basic Components (used across sections)
- **Button** — `.btn` base + `.btn-primary` / `.btn-ghost` / `.btn-small` modifiers. Hardcoded: none, purely style classes on native `<a>`/`<button>`.
- **Card** — `.card`. Generic surface wrapper, used by every section's content box and every library card.
- **DifficultyPill** — `.difficulty-pill.difficulty-{Beginner|Moderate|Steep}`. Props: `level` (enum).
- **LanguageCard** — Source: `renderLibrary()` in `script.js`. Category: basic (repeats 23x). Props: `name`, `difficulty`, `tagline`, `tags[]`, `example` (code snippet, optional), `resources[]`, `project`, `compareChecked` (bool), `expanded` (bool). Hardcoded: card structure, "+ Track"/"Resources & project" button labels.
- **ResourceLink** — Source: `resourceRow()` in `script.js`. Props: `label`, `type`, `url`.
- **QuizOption** — Source: `renderStep()` in `script.js`. Props: `label`, `sub` (subtitle).
- **CompareTable** — Source: `renderComparePanel()`. Props: `languages[]` (2-3 items).
- **ProgressChecklist** — Source: `renderProgress()`. Props: `languageName`, `startedDate`, `items[]` (label + checked), `percent`.
- **ChatBubble** — `.assistant-msg` + `.assistant-msg-user` / `.assistant-msg-assistant` modifiers. Props: `role` (enum), `content`.
- **ApiKeySetup** — `.key-setup` pattern, repeated for both the Gemini assistant and the Claude checker (`#assistant-key-setup`, `#key-setup`). Props: `provider` (Gemini | Anthropic), `getKeyUrl`.

## What's hardcoded (not props) everywhere
Section headings/copy, the "//" kicker prefix, all icon glyphs (emoji, no icon library), the brand mark `</>`, the footer tagline.
