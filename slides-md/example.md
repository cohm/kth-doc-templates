<!--
  KTH markdown slides — example deck.

  Author content here; the HTML shell (example.html) loads and renders
  this file via reveal.js's markdown plugin. Slides are separated by a
  triple-dash line surrounded by blank lines.

  This file is also the authoring cheatsheet: every brand variant
  (cover, divider, closing, line pattern) and every component
  (palette, callouts, columns, code, math, fragments, widget iframe)
  appears in a slide below. Copy from the slide that matches what you
  want.

  See README.md for the high-level overview, and the second slide
  ("Authoring cheatsheet") for a syntax reference.

  HTML-comment note: this comment block intentionally avoids showing
  literal HTML-comment delimiters, because the first inner close-comment
  sequence would terminate this outer block. The cheatsheet slide and
  the real slide-attribute comments below show the actual syntax.
-->

<!-- .slide: data-state="cover" data-transition="fade" data-pattern="tl, bl mirror-x" data-pattern-color="skyblue" -->

<p class="doctype">Activity Report · 2026</p>

# Project&nbsp;Title

<p class="subtitle">A short, informative subtitle that<br>spans up to two lines</p>

<p class="meta">
  <strong>Firstname Lastname</strong>
  School of Engineering Sciences (SCI), KTH &middot; May 2026 &middot; v1.0
</p>

---

<p class="section-name">Welcome</p>

# What's in this deck

- Authoring slides in plain **markdown**
- KTH brand chrome (logo, footer, line pattern) applied automatically
- All `data-state` variants — cover, content, divider, closing
- Palette, callouts, columns, code, math, embedded widgets
- Export to PDF via `?print-pdf` (browser) or `build-preview.mjs` (CI)

Edit `slides-md/example.md` to author your deck; the HTML shell rarely needs touching.

---

<p class="section-name">Reference</p>

# Authoring cheatsheet

<div class="cols-2">
<div>

### Slides

Three dashes on their own line, with blank lines above and below, separate slides. Two dashes nest slides vertically under their parent.

### Per-slide variants

An HTML comment with the `.slide:` prefix applied to that slide. Supported keys: `data-state` (`cover` &middot; `divider` &middot; `closing`), `data-pattern`, `data-pattern-color`, `data-transition`.

### Element classes

An HTML comment with the `.element:` prefix immediately after a markdown element annotates it with classes — e.g. `class="fragment fade-in"` to stagger reveal, or `class="kthhl"` for inline highlight.

</div>
<div>

### Line pattern

`data-pattern` is a comma-separated list of `<source> [transforms]` items. Source picks a corner of the master (`tl`, `tr`, `bl`, `br`, `full`); transforms compose (`rotate-180`, `mirror-x`, `mirror-y`). Stroke colour via `data-pattern-color` (`skyblue` &middot; `blue` &middot; `navy` &middot; `lightblue` &middot; `sand` &middot; `white` &middot; `digitalblue`).

### Brand components

Use inline raw HTML — the plugin passes it through:

- <span class="kthhl">kthhl</span> &mdash; inline keyword
- `kthbox`, `notebox` &mdash; callout panels
- `cols-2`, `cols-3` &mdash; column grids
- `iframe.widget[data-src]` &mdash; embedded widgets

</div>
</div>

The slides that follow demonstrate each of these — view the source of any slide to see the exact syntax in use.

---

<p class="section-name">Identity · Typography</p>

# Heading hierarchy

Heading sizes are explicit at presentation scale, with strong contrast between levels:

# H1 — slide title (92&nbsp;px)
<!-- .element: class="fragment fade-in" style="margin-top: 0.6em;" -->

## H2 — section heading (60&nbsp;px)
<!-- .element: class="fragment fade-in" style="margin-top: 0.6em;" -->

### H3 — subsection (44&nbsp;px)
<!-- .element: class="fragment fade-in" style="margin-top: 0.5em;" -->

#### H4 — emphasis (34&nbsp;px)
<!-- .element: class="fragment fade-in" style="margin-top: 0.4em;" -->

All sizes scale from `--r-main-font-size: 30px`. Headings and body both use <span class="kthhl">Figtree</span>.
<!-- .element: class="fragment fade-in" style="margin-top: 1em; font-size: 0.85em; color: var(--kth-gray-dark);" -->

---

<!-- .slide: data-state="divider" data-transition="convex" data-pattern="full" data-pattern-color="skyblue" -->

<p class="eyebrow">Part 1 of 2</p>

## Identity

<p class="lead">Colour, type, and layout from the KTH Grafisk manual&nbsp;v1.2 (2024).</p>

---

<p class="section-name">Identity · Colour</p>

# Palette

### Primary

<div class="palette compact" id="palette-primary">
  <div class="swatch" style="background: var(--kth-blue);">
    <div class="name">kthblue</div><div class="hex">#004791</div>
  </div>
  <div class="swatch" style="background: var(--kth-skyblue);">
    <div class="name">kthskyblue</div><div class="hex">#6298D2</div>
  </div>
  <div class="swatch" style="background: var(--kth-navy);">
    <div class="name">kthnavy</div><div class="hex">#000061</div>
  </div>
  <div class="swatch light" style="background: var(--kth-lightblue);">
    <div class="name">kthlightblue</div><div class="hex">#DEF0FF</div>
  </div>
  <div class="swatch" style="background: var(--kth-digitalblue);">
    <div class="name">kthdigitalblue</div><div class="hex">#0029ED</div>
  </div>
  <div class="swatch light" style="background: var(--kth-sand);">
    <div class="name">kthsand</div><div class="hex">#EBE5E0</div>
  </div>
  <div class="swatch light" style="background: var(--kth-white); border: 1px solid var(--kth-gray-light);">
    <div class="name">kthwhite</div><div class="hex">#FFFFFF</div>
  </div>
  <div class="swatch" style="background: var(--kth-brokenblack);">
    <div class="name">kthbrokenblack</div><div class="hex">#212121</div>
  </div>
</div>

### Functional <span style="font-size: 0.6em; font-weight: 400; color: var(--kth-gray-dark);">— five families × dark / mid / light, for charts and accents</span>

<div class="palette-fn compact" id="palette-functional">
  <div class="row-label">green</div>
  <div class="swatch"       style="background: var(--kth-green-dark);"><div class="name">dark</div><div class="hex">#0D4A21</div></div>
  <div class="swatch"       style="background: var(--kth-green);"><div class="name">mid</div><div class="hex">#4DA060</div></div>
  <div class="swatch light" style="background: var(--kth-green-light);"><div class="name">light</div><div class="hex">#C7EBBA</div></div>

  <div class="row-label">teal</div>
  <div class="swatch"       style="background: var(--kth-teal-dark);"><div class="name">dark</div><div class="hex">#1C434C</div></div>
  <div class="swatch"       style="background: var(--kth-teal);"><div class="name">mid</div><div class="hex">#339C9C</div></div>
  <div class="swatch light" style="background: var(--kth-teal-light);"><div class="name">light</div><div class="hex">#B2E0E0</div></div>

  <div class="row-label">brick</div>
  <div class="swatch"       style="background: var(--kth-brick-dark);"><div class="name">dark</div><div class="hex">#78001A</div></div>
  <div class="swatch"       style="background: var(--kth-brick);"><div class="name">mid</div><div class="hex">#E86A58</div></div>
  <div class="swatch light" style="background: var(--kth-brick-light);"><div class="name">light</div><div class="hex">#FFCCC4</div></div>

  <div class="row-label">yellow</div>
  <div class="swatch"       style="background: var(--kth-yellow-dark);"><div class="name">dark</div><div class="hex">#A65900</div></div>
  <div class="swatch light" style="background: var(--kth-yellow);"><div class="name">mid</div><div class="hex">#FFBE00</div></div>
  <div class="swatch light" style="background: var(--kth-yellow-light);"><div class="name">light</div><div class="hex">#FFF0B0</div></div>

  <div class="row-label">gray</div>
  <div class="swatch"       style="background: var(--kth-gray-dark);"><div class="name">dark</div><div class="hex">#323232</div></div>
  <div class="swatch"       style="background: var(--kth-gray);"><div class="name">mid</div><div class="hex">#A5A5A5</div></div>
  <div class="swatch light" style="background: var(--kth-gray-light);"><div class="name">light</div><div class="hex">#E6E6E6</div></div>
</div>

---

<p class="section-name">Identity · Components</p>

# Callouts &amp; highlight

<div class="cols-2">
<div>

### Highlighted box

<div class="kthbox">
  <code>.kthbox</code> — light-blue panel for summaries.
</div>

### Note box

<div class="notebox">
  <code>.notebox</code> — sand panel for caveats and asides.
</div>

</div>
<div>

### Inline highlight

Use <span class="kthhl">.kthhl</span> for keywords in bold KTH&nbsp;blue.

### Lists

- Navy bullet markers
- Fragments stagger reveal <!-- .element: class="fragment fade-in" -->
- Up-arrow rewinds them <!-- .element: class="fragment fade-in" -->

</div>
</div>

---

<p class="section-name">Identity · Layout</p>

# Two- and three-column grids

<div class="cols-3">
<div>

### Why columns?

Slide format is 16:9 wide. Three columns let you put related ideas side-by-side without crowding.

</div>
<div>

### How

Wrap content in `<div class="cols-2">` or `<div class="cols-3">`. Each direct child becomes a column.

</div>
<div>

### When

Comparisons, parallel structures, before/after, problem/solution. Avoid for narrative content.

</div>
</div>

---

<p class="section-name">Identity · Code</p>

# Syntax highlighting

```python
import numpy as np
KTH_BLUE = "#004791"
def measure(n=1024):
    rng = np.random.default_rng(42)
    return rng.normal(size=n)

print(measure().mean(), KTH_BLUE)
```

Fenced code blocks are highlighted by reveal.js's bundled highlight.js plugin. Token colours are remapped to the KTH palette in `kth-reveal.css`.

---

<p class="section-name">Identity · Math</p>

# Inline and display math

Inline math renders via KaTeX: $E = mc^2$, $\sigma = \sqrt{\frac{1}{N}\sum_i (x_i - \bar{x})^2}$.

Display math:

$$
\hat f(\xi) = \int_{-\infty}^{\infty} f(x)\, e^{-2\pi i x \xi}\, dx
$$

$$
\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
$$

KaTeX auto-loads from CDN and processes all `$…$` / `$$…$$` delimiters after Reveal initialises.

---

<p class="section-name">Identity · Lists</p>

# Fragments and lists

Reveal fragments stagger element reveal within a single slide:

- First bullet — visible immediately
- Second bullet <!-- .element: class="fragment fade-in" -->
- Third bullet <!-- .element: class="fragment fade-up" -->
- Fourth bullet <!-- .element: class="fragment highlight-blue" -->

<div class="kthbox fragment fade-in" style="margin-top: 0.8em;">
  Whole containers can also be fragments — useful for staged callouts.
</div>

Navigate with arrow keys; up-arrow rewinds fragments within a slide.

---

<p class="section-name">Identity · Figures</p>

# Images and figures

<div class="cols-2" style="grid-template-columns: 1fr 1fr; align-items: center;">
<div>

Reference images with standard markdown syntax:

```markdown
![alt](path/to/image.png)
```

Markdown wraps images in a `<p>`, so the `<!-- .element: -->` attribute syntax applies to the paragraph, not the `<img>`. To size an image directly, drop in raw HTML:

```html
<img src="logo.svg"
     style="max-height: 280px;">
```

The KTH logo is bundled alongside this deck as `KTH_logo_RGB_bla.svg`.

</div>
<div style="text-align: center;">

<img src="KTH_logo_RGB_bla.svg"
     style="max-height: 280px; background: var(--kth-lightblue); padding: 2em; border-radius: 8px;">

</div>
</div>

---

<!-- .slide: data-state="divider" data-transition="convex" data-pattern="full" data-pattern-color="skyblue" -->

<p class="eyebrow">Part 2 of 2</p>

## Interactivity

<p class="lead">Embedded widgets and arbitrary web&nbsp;apps&nbsp;— live inside your slides.</p>

---

<!-- .slide: data-transition="fade" -->

<p class="section-name">Interactivity · Embedded widgets</p>

# Drop in any web app

<div class="vcenter">
  <iframe class="widget" data-src="widgets/orbit.html" loading="lazy" style="height: 580px;"></iframe>
</div>

---

<!-- .slide: data-state="closing" data-transition="zoom" data-pattern="tl, bl mirror-x" data-pattern-color="white" -->

## Tack!

<p class="lead">Questions, comments, ideas&nbsp;— <a href="mailto:name@kth.se">name@kth.se</a></p>
