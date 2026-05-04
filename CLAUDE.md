# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

KTH document templates for two toolchains, sharing the same KTH Graphical
Profile (Grafisk manual v1.2, 2024):

- **LaTeX** — `kth-document.cls` + `example.tex`. Compile with pdflatex / xelatex / lualatex.
- **Markdown** — `md-to-pdf.{json,css}` + `example.md`. Render with [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) (Puppeteer-backed).

Both flows are kept visually aligned: same palette, same Figtree-headings /
Georgia-body fonts, same heading hierarchy and metadata block, so a `.tex`
and a `.md` rendering of the same content look like siblings.

`example.tex` and `example.md` are both the user-facing manual *and* the
smoke test. `consumer-example/` shows the recommended layout for downstream
packages that include this repo as a git submodule.

## Build

```bash
# LaTeX
pdflatex example.tex     # primary engine; uses TeX Gyre fonts as substitutes
lualatex example.tex     # exact KTH fonts (Figtree variable + Georgia) if installed
xelatex  example.tex     # exact KTH fonts via fontspec

# Markdown
md-to-pdf example.md --config-file md-to-pdf.json --document-title "Project Title"

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
