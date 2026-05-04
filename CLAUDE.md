# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A single LaTeX document class — `kth-document.cls` — implementing the KTH
Graphical Profile (Grafisk manual v1.2, 2024). Users copy the `.cls` file and
the logo into their own project; `example.tex` doubles as the annotated user
manual and the smoke test.

There is no build system, no package manager, no tests. The "deliverable" is
the rendered PDF.

## Build

```bash
pdflatex example.tex     # primary engine; uses TeX Gyre fonts as substitutes
lualatex example.tex     # exact KTH fonts (Figtree variable + Georgia) if installed
xelatex  example.tex     # exact KTH fonts via fontspec
```

After changing the class, rebuild `example.pdf` and visually inspect it — that
is the only verification mechanism. Run pdflatex twice if cross-references or
TOC anchors changed.

`.gitignore` excludes `*.aux *.log *.out *.pdf *.synctex.gz`. Do not commit
build artefacts.

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

## Editing conventions

- The class deliberately stays minimal — `geometry`, `xcolor`, `graphicx`,
  `hyperref`, `fancyhdr`, `titlesec`, `parskip`, `mdframed`, `babel`,
  `csquotes`, `iftex`, plus `microtype` on pdfLaTeX. Avoid adding more; users
  add their own packages (`amsmath`, `biblatex`, `tikz`, …) in the preamble.
- `example.tex` is the user-facing manual. When adding a feature to the class,
  document it both in the long header comment block at the top of `example.tex`
  and in `README.md`.
- Internal macros use the `\@kth…` / `\kth@…` namespace; public macros are
  un-prefixed (`\subtitle`, `\doctype`, `\shorttitle`, `\version`,
  `\affiliation`, `\kthhl`, `\kthlogopath`, `\kthlogoheight`).
