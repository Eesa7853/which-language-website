# Routes

No router — this is one physical page (`index.html`) with in-page anchor navigation. The nav bar and several buttons link to `#section-id`, and `scroll-behavior: smooth` on `<html>` makes the jump animated. Each section also sets `scroll-margin-top` so it doesn't land underneath the sticky header.

| Anchor | Section | Purpose |
|---|---|---|
| `#` (hero, no id, top of page) | `.hero` | Landing pitch, quiz/library CTAs, clickable code-editor language demo |
| `#ask` | `.ask-section` | Free-text "just tell me what you want to build" instant matcher |
| `#assistant` | `.assistant-section` | Gemini-powered chat assistant (BYOK) |
| `#quiz` | `.quiz-section` | 4-question quiz → recommendation |
| `#checker` | `.checker-section` | Claude-powered "check my code" photo upload (BYOK) |
| `#progress` | `.progress-section` | localStorage-backed progress checklist for the tracked language |
| `#library` | `.library-section` | Full 23-language grid, search, tag filters, compare |

All seven sections render inside one `<main>`, in this order, for every visitor — there's no conditional routing or auth-gated content.
