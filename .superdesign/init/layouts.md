# Layouts

This is a single-page site (one `index.html`, anchor-based sections). There is no router/multi-page layout system — the "layout" is just the shared header and footer wrapping one long `<main>`.

## Header — `.site-header` (in `index.html`)
Sticky, blurred, appears on every scroll position. Contains: brand mark (`</>`  in a rounded chip) + brand name, a nav of anchor links to each section, and the dark-mode toggle button (far right).

```html
<header class="site-header">
  <div class="wrap">
    <div class="brand">
      <span class="brand-mark">&lt;/&gt;</span>
      <span class="brand-name">Which Language?</span>
    </div>
    <nav>
      <a href="#ask">Just ask</a>
      <a href="#assistant">Assistant</a>
      <a href="#quiz">Take the quiz</a>
      <a href="#checker">Check my code</a>
      <a href="#progress">My progress</a>
      <a href="#library">Browse languages</a>
    </nav>
    <button type="button" id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
      <span class="theme-toggle-icon">🌙</span>
    </button>
  </div>
</header>
```

## Footer — `.site-footer`
```html
<footer class="site-footer">
  <div class="wrap">
    <p>Built to help you stop stalling and start writing code. No language is truly "wrong" — the best one is the one that gets you building.</p>
  </div>
</footer>
```

## `.wrap` — the shared content-width container
```css
.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
```
Every section's content sits inside a `.wrap`. Do not remove this when redesigning sections — it's what keeps line lengths readable.

## Theme bootstrap (inline `<head>` script, before `style.css` loads)
```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    } catch {}
  })();
</script>
```
Runs synchronously before CSS paints, to avoid a flash of the wrong theme. Any redesign must keep this (or an equivalent) working — don't move theme application into the deferred `script.js` module.
