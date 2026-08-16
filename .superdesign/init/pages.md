# Pages

Single page. Entry: `index.html`, loads `style.css` and `script.js` (`type="module"`, defer semantics).

## / (only page)
Entry: `language-advisor/index.html`
Dependencies:
- `language-advisor/style.css` (all styling, no per-section split)
- `language-advisor/script.js` (ES module, all behavior — no per-section split; ~1720 lines)
  - `config.local.js` (dynamic `import()`, gitignored, optional — provides a fallback Gemini key; wrapped in try/catch so a missing file doesn't crash the page)
  - External: `esm.sh` CDN import of `@anthropic-ai/sdk` (loaded lazily, only when the code-checker feature is actually used)
  - External: Google Fonts (`Sora`, `Inter`) via `<link>`
  - External runtime calls: Google Gemini REST API (`fetch`, assistant section), Anthropic Messages API (via the SDK, code-checker section) — both BYOK, key typed in by the visitor or read from `config.local.js`

## Section → JS module mapping (since there's no per-page split, this is the closest equivalent to a dependency tree)
- Hero code-window: `HERO_SNIPPETS` data + click handlers near the top of `script.js`
- `#ask`: `matchGoal()`, `renderAskResult()`, `GOAL_KEYWORDS` data
- `#assistant`: Gemini fetch/streaming logic, `addMessage()`-style rendering (~line 1447 area)
- `#quiz`: `QUIZ` data, `renderStep()`, `selectOption()`, `showResult()`
- `#checker`: Anthropic SDK call, photo upload/resize, `CORRECTION_SCHEMA` structured-output schema
- `#progress`: `getProgress()`/`setProgress()` (localStorage), `renderProgress()`
- `#library`: `LANGUAGES` data (23 entries), `renderLibrary()`, `renderComparePanel()`, `renderTagFilters()`

## For context-file selection when designing a specific section
Pass `index.html` + `style.css` always (they're small enough and are the full UI surface). For `script.js`, prefer targeted excerpts (the relevant render function + its data array) over the whole file — it's ~78KB and mixes UI templates with business logic (API calls, scoring) that a design pass doesn't need.
