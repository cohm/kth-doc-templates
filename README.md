# kth-document — KTH Document Templates

Professional KTH document templates for **LaTeX** and **Markdown**, both
implementing the
[KTH Graphical Profile](https://intra.kth.se/administration/kommunikation/varumarke/grafiskprofil)
(Grafisk manual v1.2, 2024). Use them for project descriptions, 
memos, as a git submodule for package documentation, etc.

## Previews

| LaTeX (`example.tex` → lualatex) | Markdown (`example.md` → md-to-pdf) |
|----------------------------------|--------------------------------------|
| ![](docs/preview/example-tex.png) | ![](docs/preview/example-md.png) |

The previews above are regenerated automatically by CI on every push to
`main`, so they always reflect the current state of the templates. PDFs
from each CI run are available as workflow artefacts.

## Files

| File | Purpose |
|------|---------|
| `kth-document.cls` | The LaTeX document class — copy this (and the logo) into your project |
| `md-to-pdf.{json,css}` | Markdown theme for [md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) |
| `example.tex`, `example.md` | Fully annotated examples / starting points |
| `KTH_logo_RGB_bla.png` | KTH logo (blue, PNG) — place next to your source file |
| `consumer-example/` | Recommended layout for using this repo as a git submodule |

## Quick start (LaTeX)

```latex
\documentclass[english, 11pt]{kth-document}

\title{My Document}
\subtitle{An optional subtitle}
\doctype{Activity Report}
\author{Firstname Lastname}
\affiliation{School of Engineering Sciences (SCI), KTH}
\date{\today}
\version{1.0}          % optional
\shorttitle{My Doc}    % shown in header on pages 2+

\begin{document}
\maketitle
...
\end{document}
```

Compiling with `pdflatex` works just fine, but if you use `lualatex`/`xelatex` you get the exact KTH fonts. The CI uses `lualatex` for the generated preview image.

## Quick start (Markdown)

[md-to-pdf](https://github.com/simonhaenisch/md-to-pdf) is an npm package
that wraps Puppeteer (headless Chromium). Install it once globally:

```bash
npm install -g md-to-pdf
```

The first install also downloads a Chromium build (~150 MB) for Puppeteer.
Then build a document:

```bash
md-to-pdf report.md \
  --config-file md-to-pdf.json \
  --document-title "My Document"
```

Place `![](KTH_logo_RGB_bla.png)` as the first line of your `.md` to use the
KTH logo as the title-block image. Use `<p class="subtitle">…</p>` and
`<p class="doctype">…</p>` for the metadata lines below the title, and
`<div class="notebox">…</div>` / `<span class="kthhl">…</span>` for the
sand-coloured note boxes and inline keyword highlights. Plain blockquotes
(`> …`) render as the light-blue summary boxes.

## Use as a git submodule

The recommended pattern for downstream packages is to add this repo as a
submodule under your `docs/` directory:

```bash
cd your-package
git submodule add https://github.com/kth/kth-doc-templates docs/.templates
cp docs/.templates/consumer-example/docs/Makefile docs/Makefile
```

Then write `docs/report.md` or `docs/report.tex` and run `make` from `docs/`.
The Makefile sets `TEXINPUTS=.:.templates:` for pdflatex (so
`\documentclass{kth-document}` resolves with no path prefix) and points
md-to-pdf at the submodule's config and stylesheet. See
[`consumer-example/`](consumer-example/) for the full layout.

## Class options

| Option | Effect |
|--------|--------|
| `english` | English locale — babel, standard decimal point *(default)* |
| `swedish` | Swedish locale — babel, decimal comma via `icomma` |
| `titlepage` | Full separate title page instead of inline title block |
| `10pt` / `11pt` / `12pt` | Base font size; heading sizes scale proportionally *(default: 11pt)* |
| *(any other)* | Passed through to the standard `article` class |

## Metadata commands

| Command | Description |
|---------|-------------|
| `\title{...}` | Document title *(required)* |
| `\subtitle{...}` | Subtitle shown below the title |
| `\doctype{...}` | Document type label, e.g. `Activity Report` |
| `\author{...}` | Author name(s) |
| `\affiliation{...}` | Department or school, shown next to the author |
| `\date{...}` | Date — use `\today` or a fixed string |
| `\version{...}` | Version string, rendered as `(vX.Y)` after the date |
| `\shorttitle{...}` | Short title shown in the header on pages 2 and beyond |

## Callout environments

```latex
\begin{kthbox}
  Light-blue box — use for summaries, key points, or notices.
\end{kthbox}

\begin{kthnotebox}
  Sand-coloured box — use for notes, caveats, or supplementary info.
\end{kthnotebox}
```

Inline: `\kthhl{keyword}` renders text in bold KTH blue.

## Colors

All colors from the KTH Grafisk manual are defined as named colors and can be
used anywhere with `\textcolor{name}{...}` or `\colorbox{name}{...}`.

**Primary palette**

| Name | Hex | Notes |
|------|-----|-------|
| `kthblue` | `#004791` | Brand blue — headings, rules, hyperlinks |
| `kthskyblue` | `#6298D2` | Sky blue |
| `kthnavy` | `#000061` | Navy — logo wreath color |
| `kthlightblue` | `#DEF0FF` | Light blue tint (`kthbox` background) |
| `kthsand` | `#EBE5E0` | Warm sand grey (`kthnotebox` background) |
| `kthwhite` | `#FFFFFF` | White |
| `kthdigitalblue` | `#0029ED` | Screen only — use `kthblue` for print |

**Functional palette** — for diagrams, charts, and reports.
Each family has three variants named `kth{dark,<empty>,light}{family}`:

| Family | Dark | Mid | Light |
|--------|------|-----|-------|
| `green` | `#0D4A21` | `#4DA060` | `#C7EBBA` |
| `teal` | `#1C434C` | `#339C9C` | `#B2E0E0` |
| `brick` | `#78001A` | `#E86A58` | `#FFCCC4` |
| `yellow` | `#A65900` | `#FFBE00` | `#FFF0B0` |
| `gray` | `#323232` | `#A5A5A5` | `#E6E6E6` |

Grey spellings (`kthgrey`, `kthdarkgrey`, `kthlightgrey`) are also accepted.
Aliases: `kthaccent` = `kthblue`, `kthmuted` = `kthsand`.

## Fonts

| Engine | Heading font | Body font |
|--------|-------------|-----------|
| `pdflatex` | TeX Gyre Heros (Helvetica clone) | TeX Gyre Pagella (Palatino clone) |
| `lualatex` | Figtree variable font *(if installed)*, else TeX Gyre Heros | Georgia *(if installed)* |
| `xelatex` | Figtree *(if installed)*, else TeX Gyre Heros | Georgia *(if installed)* |

Figtree is the official KTH heading font, available free from
[Google Fonts](https://fonts.google.com/specimen/Figtree) and the KTH Software Center.
Georgia is pre-installed on most systems. Both are optional — the class falls back
gracefully if they are not found.

## Logo

The logo is shown only on the first page (in the title block). The class looks
for the file named by `\kthlogopath` in order: `.pdf` → `.png` → `.eps`.

```latex
% Default — looks for KTH_logo_RGB_bla.{pdf,png,eps}
% Override with:
\renewcommand{\kthlogopath}{/path/to/your-logo}  % no extension
\renewcommand{\kthlogoheight}{1.8cm}              % adjust size
```

## Adding packages

The class loads: `geometry`, `xcolor`, `graphicx`, `hyperref`, `fancyhdr`,
`titlesec`, `parskip`, `mdframed`, `babel`, `csquotes`, `iftex`,
and `microtype` (pdfLaTeX only). All standard packages are safe to add in
the preamble as usual — `amsmath`, `booktabs`, `biblatex`, `siunitx`, `tikz`, etc.

## License

The class file is released under the
[MIT License](https://opensource.org/licenses/MIT).
The KTH logo and graphical profile are owned by KTH Royal Institute of Technology
and may only be used in accordance with the
[KTH Graphical Profile guidelines](https://intra.kth.se/administration/kommunikation/varumarke/grafiskprofil).
