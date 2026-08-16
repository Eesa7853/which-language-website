# Components

No component framework — "components" here are (a) shared CSS classes used as primitives across the vanilla HTML, and (b) JS functions in `script.js` that generate repeated HTML via template strings. Full source included below for the ones that matter most to a redesign.

## Shared CSS primitives (used across every section)

- `.card` — the base surface: `background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow);`
- `.btn` / `.btn-primary` (accent gradient fill) / `.btn-ghost` (outline) / `.btn-small` (compact variant) — pill-shaped buttons, used everywhere
- `.difficulty-pill` + `.difficulty-Beginner|Moderate|Steep` — solid-color uppercase status pill

## `resourceRow(r)` — resource link row (script.js:798)
Used inside quiz results, "just ask" results, and every library card's expanded resources.
```js
function resourceRow(r) {
  return `<a class="resource-link" href="${r.url}" target="_blank" rel="noopener noreferrer">
    ${r.label} <span class="rtype">${r.type}</span>
  </a>`;
}
```

## Quiz option button (script.js:742, `renderStep`)
```js
const optionsHtml = step.options.map((opt, i) => `
  <button class="quiz-option" data-index="${i}">
    ${opt.label}
    <span class="opt-sub">${opt.sub}</span>
  </button>
`).join("");
```

## Language library card (script.js:934, `renderLibrary`)
The most important repeated component on the page — 23 instances render in `#lang-grid`.
```js
langGrid.innerHTML = filtered.map(l => `
  <div class="card lang-card" id="lang-${l.id}" data-id="${l.id}">
    <div class="lang-card-top">
      <h3>${l.name}</h3>
      <label class="compare-check">
        <input type="checkbox" class="compare-checkbox" data-id="${l.id}" ${compareSelection.includes(l.id) ? "checked" : ""}>
        Compare
      </label>
    </div>
    <span class="difficulty-pill difficulty-${l.difficulty}">${l.difficulty}</span>
    <p class="lang-tagline">${l.tagline}</p>
    <div class="lang-tags">${l.tags.map(t => `<span>${t}</span>`).join("")}</div>
    <div class="lang-card-actions">
      <button type="button" class="btn btn-primary btn-small track-btn" data-id="${l.id}">+ Track</button>
      <button type="button" class="btn btn-ghost btn-small resources-toggle-btn">Resources &amp; project</button>
    </div>
    <div class="lang-resources">
      ${l.example ? `<pre class="lang-example"><code>${l.example}</code></pre>` : ""}
      ${l.resources.map(resourceRow).join("")}
      <p class="lang-project"><strong>Project idea:</strong> ${l.project}</p>
    </div>
  </div>
`).join("");
```
`.lang-resources` is `display:none` until `.lang-card.expanded` — toggled by the "Resources & project" button, NOT by clicking the card (that was changed from click-to-expand in an earlier redesign; the checkbox and buttons `stopPropagation()`).

## Compare table (script.js:1007, `renderComparePanel`)
Renders when 2-3 languages have their compare checkbox ticked.
```js
comparePanel.innerHTML = `
  <div class="compare-panel-head">
    <h3>Comparing ${langs.length} languages</h3>
    <button id="clear-compare-btn" class="btn btn-ghost btn-small">Clear</button>
  </div>
  <div class="compare-table-wrap">
    <table class="compare-table">
      <thead><tr><th></th>${langs.map(l => `<th>${l.name}</th>`).join("")}</tr></thead>
      <tbody>
        <tr><td>Difficulty</td>${langs.map(l => `<td><span class="difficulty-pill difficulty-${l.difficulty}">${l.difficulty}</span></td>`).join("")}</tr>
        <tr><td>Tags</td>${langs.map(l => `<td><div class="compare-tags">${l.tags.map(t => `<span>${t}</span>`).join("")}</div></td>`).join("")}</tr>
        <tr><td>Description</td>${langs.map(l => `<td>${l.tagline}</td>`).join("")}</tr>
        <tr><td>First project</td>${langs.map(l => `<td>${l.project}</td>`).join("")}</tr>
      </tbody>
    </table>
  </div>
`;
```

## Progress checklist (script.js:1092, `renderProgress`)
```js
progressCard.innerHTML = `
  <div class="progress-head">
    <div>
      <div class="progress-eyebrow">Currently learning</div>
      <h3 class="progress-lang-name">${lang.name}</h3>
      <p class="progress-started">Started ${startedDate}</p>
    </div>
    <button id="stop-tracking-btn" class="btn btn-ghost btn-small">Switch language</button>
  </div>
  <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
  <p class="progress-pct">${doneCount} of ${items.length} done (${pct}%)</p>
  <div class="progress-checklist">
    ${items.map(it => `
      <label class="progress-item">
        <input type="checkbox" data-key="${it.key}" ${p.checkedKeys.includes(it.key) ? "checked" : ""}>
        <span>${it.label}</span>
      </label>
    `).join("")}
  </div>
`;
```

## Hero code-window illustration (index.html + script.js `HERO_SNIPPETS`)
A fake dark code editor (macOS traffic-light dots, filename tab, syntax-highlighted `<pre>`) with clickable language pills below that swap `#code-window-file` text and `#code-window-body` innerHTML. `.code-window-body` has a fixed `min-height` (sized for the tallest snippet) specifically to prevent layout shift when switching languages — do not remove that when redesigning, it was a deliberate bug fix.
