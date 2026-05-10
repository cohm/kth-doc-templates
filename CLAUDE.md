# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

KTH document templates for three toolchains, sharing the same KTH Graphical
Profile (Grafisk manual v1.2, 2024):

- **LaTeX** — `kth-document.cls` + `example.tex`. Compile with pdflatex / xelatex / lualatex.
- **Markdown** — `md-to-pdf.{json,css}` + `example.md`. Render with [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) (Puppeteer-backed).
- **Slides** — `reveal/kth-reveal.css` + `reveal/example.html`. Open directly in a browser; reveal.js loads from CDN. Print-PDF via `?print-pdf` query.

All three flows are kept visually aligned: same palette, same Figtree-headings /
Georgia-body fonts, same heading hierarchy and metadata block, so the
rendered outputs of the same content look like siblings.

`example.tex`, `example.md`, and `reveal/example.html` are all both the
user-facing manual *and* the smoke test. `consumer-example/` shows the
recommended layout for downstream packages that include this repo as a git
submodule.

## Build

```bash
# LaTeX
pdflatex example.tex     # primary engine; uses TeX Gyre fonts as substitutes
lualatex example.tex     # exact KTH fonts (Figtree variable + Georgia) if installed
xelatex  example.tex     # exact KTH fonts via fontspec

# Markdown
md-to-pdf example.md --config-file md-to-pdf.json --document-title "Project Title"

# Slides
open reveal/example.html                                       # live preview
npm install --no-save puppeteer                                # one-time, in repo root
node reveal/build-preview.mjs                                  # → docs/preview/example-reveal.png + example-reveal.pdf

# Consumer example (exercises the submodule pattern via a .templates symlink)
make -C consumer-example/docs
```

Run pdflatex twice if cross-references or TOC anchors changed. After changing
either flow, rebuild and visually inspect — there are no automated correctness
checks beyond "does it produce a PDF without errors."

`.gitignore` excludes `*.aux *.log *.out *.pdf *.synctex.gz`. Do not commit
build artefacts; `docs/preview/*.png` is the one exception (those are
auto-generated previews, see CI section).

## CI and preview images

`.github/workflows/build.yml` runs on every push and PR:

1. Builds `example.tex` (pdflatex), `example.md` (md-to-pdf), and the
   consumer-example via its Makefile — each is a smoke test of one flow.
2. Renders first-page PNG previews of the two `example.*` outputs at 150 dpi
   via `pdftoppm`, into `docs/preview/example-{tex,md}.png`.
3. Uploads all PDFs as a workflow artefact (`pdfs`).
4. **On push to main only:** commits the regenerated PNGs back to
   `docs/preview/` with `[skip ci]`. The `paths-ignore: ['docs/preview/**']`
   filter on the workflow prevents the auto-commit from triggering itself.

The `README.md` references those PNGs directly, so the README always shows
the current state of the templates.

## Architecture of `kth-document.cls`

The class is one file, ~430 lines, organised as section banners. A few
non-obvious things to know before editing:

- **Engine-conditional font loading** (`\ifXeTeX` / `\ifLuaTeX` / pdfLaTeX
  fallback). LuaLaTeX needs the HarfBuzz renderer with a `wght` axis to address
  Figtree's variable-font weights — XeLaTeX uses the named family `Figtree
  SemiBold` instead. pdfLaTeX uses TeX Gyre Heros + Pagella as substitutes.
  All three branches define `\sfheading` so the rest of the class is
  engine-agnostic.

- **Proportional heading sizes.** All title and section sizes are stored as
  `\dimen` registers (`\kth@secsize`, `\kth@titlesize`, …) computed from
  `\f@size` in `\AtBeginDocument`. They scale automatically with the `10pt` /
  `11pt` / `12pt` class option. When adding a new heading level, follow the
  same pattern (define a dimen, set it from `\kth@basesize` in
  `\AtBeginDocument`, use `\fontsize{\strip@pt\kth@…size}{…}\selectfont`).

- **Section numbering is tracked but hidden.** `secnumdepth=3` so hyperref
  anchors are unique, but `\titleformat` omits the number. To re-enable
  display, add `{\thesection\quad}` to the relevant format's label argument
  — comments in the file mark the spot.

- **Two title modes.** The `titlepage` class option toggles between the inline
  title block (default, `\maketitle` puts everything at the top of page 1) and
  a full `titlepage` environment. Both are defined in the same `\if@kthtitlepage
  … \else … \fi` block; keep them visually consistent when changing one.

- **Logo resolution.** `\@kthlogo` searches `\kthlogopath.{pdf,png,eps}` in
  that order with `\IfFileExists`. The default path is `KTH_logo_RGB_bla` (no
  extension). Missing logo → silent vertical-space placeholder, never an error.

- **Locale via class options.** `english` (default) and `swedish` toggle babel
  language and whether `icomma` is loaded for decimal-comma formatting.

## Colour palette

All KTH colours are defined as named `xcolor` colours in the class. The full
table lives in `README.md` and `example.tex` (which also renders swatches).
British spellings (`kthgrey` etc.) are aliased to the American forms; aliases
`kthaccent` (= `kthblue`) and `kthmuted` (= `kthsand`) exist for semantic use.

When adding a colour, define it in the colours section of the class and add a
swatch row to the colour-reference section in `example.tex`.

## Markdown theme (`md-to-pdf.{json,css}`)

The CSS mirrors the LaTeX class's visual decisions, not its mechanism:

- Heading sizes are expressed as `em` multiples of body size (1.65× / 1.25× /
  1.10× / 1.0× for h1–h4) — the same ratios as the LaTeX `\kth@*size` dimens.
- All KTH colours are exposed as CSS custom properties on `:root`, named
  `--kth-blue`, `--kth-green-dark`, `--kth-yellow-light`, etc. Use these
  rather than hard-coded hex values when extending the theme.
- `@page :first { margin-top: 20mm; }` mimics `\thispagestyle{empty}` on
  page 1 — leaves room for the logo while pushing the running header and
  blue rule off the cover page. The header is restored from page 2 onward
  via Puppeteer's `headerTemplate`.
- The first-image-only `<p>` at the top of a `.md` is sized to 2cm — the
  Markdown analogue of `\kthlogoheight`. Document this convention when
  changing logo behaviour.

When changing the `md-to-pdf.json`'s `headerTemplate` / `footerTemplate`,
remember Chromium runs them in a stripped context: only inline CSS works,
font sizes don't inherit, and there's no API to detect first page (hence
the `@page :first` margin trick).

## Reveal.js slide theme (`reveal/`)

`reveal/kth-reveal.css` is the third toolchain. The visual design follows
the official KTH PowerPoint master, using the
[kthpq](https://github.com/th-rtyf-re/kthpq) Beamer port as the reference
since the .pptx itself is auth-walled on intra.kth.se. Mirrors the *same*
KTH custom properties as `md-to-pdf.css` so the palette is a single
conceptual source of truth across all three flows.

Layout per slide variant (set via `data-state` on `<section>`):

| variant | bg | logo | footer | line motif |
|---------|----|------|--------|-----------|
| cover (default) | `--kth-lightblue` | large, top-centre | — | sky-blue official 16:9 |
| (no state) | `--kth-brokenwhite` | small, top-left | author / institute / page | — |
| divider | `--kth-sand` | small, top-left | (same) | sky-blue, mirrored |
| closing | `--kth-blue` | white, centred (filter-inverted) | — | white official 16:9 |

Things to know before editing:

- **CDN over npm.** `example.html` loads `reveal.js@5.x` from jsDelivr,
  Figtree from Google Fonts. Zero install — `open reveal/example.html`
  works. We deliberately avoid a `package.json` in the repo root to keep
  the onboarding story flat. `puppeteer` is only pulled in transiently by
  the CI preview script (`build-preview.mjs`).

- **Logo asset map: vector everywhere.** Two formats for the same KTH
  blue logo, one per toolchain's preferred format:
  - `KTH_logo_RGB_bla.svg` (repo root + `reveal/`) — the canonical web
    asset shipped by KTH. Used by `<img>` in `reveal/example.html` and
    by `![]()` references in Markdown sources. ~55 KB.
  - `KTH_logo_RGB_bla.pdf` (repo root only) — derived one-off from the
    SVG via `inkscape --export-type=pdf`. Used by `\includegraphics`
    in the LaTeX class. ~35 KB. RGB colour space matches the SVG, so
    the LaTeX output is colour-faithful with the HTML/MD renders.
  Two copies of the SVG (root + reveal/) are deliberate, not a symlink:
  Safari ≥13 treats each `file://` URL as having a unique origin and
  blocks parent-directory traversal even through a symlink, so
  `<img src="../KTH_logo_RGB_bla.svg">` would silently 404 in Safari.
  Same-directory-only references work everywhere. The class's
  `\kthlogopath` search order (`.pdf → .png → .eps`) is unchanged —
  we just don't ship a PNG anymore; downstream users who want to point
  at their own raster can still drop one in alongside `\renewcommand`.
  If KTH ever updates the logo, replace both SVGs and re-run Inkscape
  to refresh the PDF.

- **Sizing.** Base font size is `42px` and heading sizes are explicit pixel
  values (`92 / 60 / 44 / 34px` for `h1`–`h4`) — presentation-scale, not
  document-scale. To resize the whole deck, change `--r-main-font-size`
  and the four `--r-heading*-size` values in one place.

- **Master chrome is injected per-section by JS** (see `injectMasterChrome`
  in `example.html`), not via a single global overlay. This is essential
  for print-pdf mode, where reveal stacks every slide into one DOM —
  body-class-based chrome would only style the *current* slide and leave
  the rest unstyled in the exported PDF.

- **Print-PDF padding override.** Reveal's print stylesheet sets
  `padding: 0 !important; min-height: 1px;` on every section. Re-apply
  the cover / divider / closing / content padding under
  `html.reveal-print .reveal .slides section[data-state="…"]` (descendant
  combinator — *not* `>`, because in print mode sections sit inside
  `.pdf-page` wrappers).

- **Don't let any single slide's content + padding exceed 1080px.**
  Reveal's print code computes
  `numberOfPages = Math.ceil(slide.scrollHeight / pageHeight)` and renders
  each over-tall slide on a 2160px-tall PDF page (one filled, one blank).
  The empty page in the exported PDF is the symptom. Slide 12 (iframe
  widget) is the closest to the limit — keep iframe height ≤ ~580px when
  it's the slide's main content.

- **White logo on the closing slide is rendered by inverting the black SVG**
  with `filter: brightness(0) invert(1)`. CSS filters apply to the
  rasterised render of an `<img>` regardless of source format, so the
  trick works identically on the SVG as it did on the PNG it replaced.
  No separate "white" file required.

- **Linjemönster (line pattern).** The 1920×1080 master is split into
  corner-specific path groups (`KTH_PATTERN_PATHS` in `example.html`'s
  `<script>` block). Each `.kth-pattern` instance renders only the paths
  for its source corner, so the visible motif sits flush against the
  slide edges — no orphan strokes through the middle the way a clipped
  full-bleed render would have. The paths use `stroke="currentColor"`,
  so the brand palette is applied via plain CSS (`color: var(--kth-…)`,
  one rule per palette name). No external SVG file, no `mask-image`, no
  `<object>` — all three were flaky over `file://`. Author API:
  `<section data-pattern="tl, bl mirror-x" data-pattern-color="skyblue">`,
  where `data-pattern` is a comma-separated list of pattern instances.
  Each instance is `<source> [transforms]`: source is `tl|tr|bl|br|full`,
  transforms compose `rotate-180 | mirror-x | mirror-y` (90°/270° aren't
  exposed — master is 16:9). Transforms apply to the inner `<svg>` (not
  the wrapper), so e.g. "bl mirror-x" renders only path 2 and flips it
  horizontally, landing the BL content in the slide's BR with its
  straight sides still flush against the slide edges. `data-pattern`
  with no value is shorthand for `full`. Implements Brand guidelines
  pp. 23–28 (insert / rotate-mirror / crop). The logo safe-zone patches
  (`section[data-state="cover"]::after`, `section[data-state="closing"]::after`)
  implement the p.27 rule "Never place the line pattern behind KTH's
  logotype" by punching a slide-bg-coloured rectangle through the
  pattern at the logo position.

- **Slide-background colours via JS mirror.** Reveal does *not* propagate
  `data-state` from `<section>` to its generated `.slide-background` div.
  The example deck mirrors it via `slide.slideBackgroundElement`, so
  per-state background colours (`.slide-background[data-state~="cover"]`)
  actually apply.

- **Embedding widgets.** Use `<iframe class="widget" data-src="…">` (note
  `data-src`). Reveal sets `src` only when the slide is in view, keeping
  off-screen iframes idle. Drop standalone HTML into `reveal/widgets/` —
  `orbit.html` is the reference. Note: in `?print-pdf` exports, iframes
  render blank because puppeteer doesn't load lazy iframes during the
  print snapshot — that's expected; the live deck is the canonical
  presentation, the PDF is for handouts.

- **Author / institute footer text** is set via `data-kth-author` and
  `data-kth-institute` attributes on the `.reveal` wrapper — read once at
  init time by `injectMasterChrome`.

- **CI preview.** `reveal/build-preview.mjs` spins up a local static
  server, drives Puppeteer to screenshot slide 1 (the cover) at
  1920×1080, and exports the full deck via `?print-pdf` to
  `example-reveal.pdf`. The GH workflow installs puppeteer into
  `$RUNNER_TEMP/puppeteer-deps` and points `NODE_PATH` at it.

## Consumer-example pattern

`consumer-example/docs/.templates` is a symlink to `../..` (the repo root).
This lets the example actually build during local dev and CI without a real
git submodule round-trip. Downstream packages would add a real submodule at
the same path. Don't replace the symlink with copies of the files — that
defeats the purpose of the smoke test.

## Editing conventions

- The LaTeX class deliberately stays minimal — `geometry`, `xcolor`,
  `graphicx`, `hyperref`, `fancyhdr`, `titlesec`, `parskip`, `mdframed`,
  `babel`, `csquotes`, `iftex`, plus `microtype` on pdfLaTeX. Avoid adding
  more; users add their own packages (`amsmath`, `biblatex`, `tikz`, …) in
  the preamble.
- `example.tex` and `example.md` are user-facing manuals. When adding a
  feature, document it in the relevant `example.*` and in `README.md`. Keep
  the two examples in sync — same sections, same content shape — so the
  preview images stay comparable.
- LaTeX internal macros use the `\@kth…` / `\kth@…` namespace; public macros
  are un-prefixed (`\subtitle`, `\doctype`, `\shorttitle`, `\version`,
  `\affiliation`, `\kthhl`, `\kthlogopath`, `\kthlogoheight`).
- CSS custom classes for Markdown: `.kthhl`, `.notebox`, `p.subtitle`,
  `p.doctype`. Mirror these when adding new LaTeX environments/macros.
