# Memory

_Last updated: 2026-08-16_

## Project

**"Which Language?"** — a static website at `language-advisor/` inside this folder. Helps people pick a programming language to learn: a quiz, a free-text "just ask" matcher, an AI chat assistant, a photo-based code checker, a progress tracker, and a full language library with a compare tool.

- Plain HTML/CSS/JS. No framework, no build step. `script.js` loads as an ES module.
- Files: `index.html`, `style.css`, `script.js`, `serve.ps1` (local static server), `config.local.js` (gitignored, has a real Gemini key in it), `config.example.js` (committed template), `package.json` + `playwright.config.js` + `tests/site.spec.js` (Playwright test suite).
- Run it locally: `.claude/launch.json` has a `language-advisor` dev-server config (serves on `http://localhost:8095` via `serve.ps1`). Use the Browser preview tool with that name, or run `powershell -File language-advisor/serve.ps1` directly.
- Run tests: `cd language-advisor && npm test` (Playwright — Node.js + Chromium already installed on this machine).
- Design: light/white theme only (no dark mode — this was explicitly requested), warm off-white background, blue accent. CSS variables on `:root`.

## Features built so far

1. **Hero** — quiz CTA + link to "just ask".
2. **"Just ask"** (`#ask`) — instant keyword-based matcher, no AI/API key needed. `GOAL_KEYWORDS` table in `script.js`.
3. **"Ask the assistant"** (`#assistant`) — real conversational chat, powered by **Google Gemini** (`gemini-flash-lite-latest`, plain `fetch` to the REST API, no SDK). BYOK: visitor pastes their own key, saved in `localStorage` under `geminiAssistant.apiKey`, OR falls back to the hardcoded key in `config.local.js` if present (prototype convenience — that key is gitignored, never committed). Search-grounding (for real video links) is only attached when the message looks like a video request, because merely declaring the tool trips this key's quota even unused. Falls back to a plain answer (with an honest "couldn't search" note) if grounding fails — never lets the model invent a fake video URL.
4. **Quiz** (`#quiz`) — 4 questions, weighted scoring across the `LANGUAGES` array.
5. **"Check my code"** (`#checker`) — photo upload, resized client-side, sent to **Claude** (Anthropic SDK via `esm.sh` CDN import, `client.messages.create` with structured JSON output) to find/fix mistakes. BYOK, separate key storage (`codeChecker.apiKey`) from the Gemini one. Model picker: Claude Opus 5 vs Haiku 4.5.
6. **"My progress"** (`#progress`) — tracks one language's resource checklist, persisted to `localStorage`.
7. **Library** (`#library`) — 17 languages, search/filter, "+Compare" (up to 3 side by side).

## Language data

`LANGUAGES` array in `script.js` — 17 entries: Python, JavaScript, TypeScript, Java, C#, C++, C, Go, Rust, Swift, Kotlin, Dart/Flutter, PHP, Ruby, SQL, R, Lua. Every language has a real, verified MCP-related GitHub resource link (mostly official `modelcontextprotocol/*-sdk` repos; community ones for C, C++, Dart, Lua; Posit's `mcptools` for R).

## Known issues / open items

- **Gemini key's Search grounding quota is exhausted** — the assistant can't return real video links right now; degrades gracefully instead of failing. Will start working once quota resets or billing is enabled on that Google Cloud project.
- **That Gemini key was pasted directly in chat** — flagged to the user to rotate/revoke it. Unclear if they did.
- **Not yet pushed to GitHub.** User wants a private repo. No `gh` CLI installed, no GitHub MCP server connected in this environment. Plan was: use `gh` CLI + browser login (avoid pasting a PAT in chat, since the Gemini key already got exposed that way once). This is still unresolved — need to install `gh`, authenticate, then create+push.
- `.gitignore` at the project root already excludes `config.local.js`, `node_modules/`, `test-results/`, `playwright-report/`.

## Working style notes

- User prefers fast, direct action over long explanations; terse/typo-heavy messages are normal for them, not hostility to mirror.
- Strong preference for **never hallucinating URLs/facts** — this came up repeatedly (fake MCP repo risk, fake YouTube links from Gemini) and the user cares about it; always verify real links exist before adding them (WebFetch/WebSearch), never invent plausible-looking ones.
- Be upfront and proactive about security issues (e.g. pasted API keys) without being preachy — flag once, clearly, then move on.
- When something breaks, actually test/verify the fix (don't just claim it works) — this was reinforced multiple times in this project.
