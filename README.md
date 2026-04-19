# kth-document — KTH LaTeX Document Template

A clean LaTeX document class for professional KTH documents — activity reports,
project descriptions, memos, and similar. Implements the
[KTH Graphical Profile](https://intra.kth.se/administration/kommunikation/varumarke/grafiskprofil)
(Grafisk manual v1.2, 2024).

## Files

| File | Purpose |
|------|---------|
| `kth-document.cls` | The document class — copy this (and the logo) into your project |
| `example.tex` | Fully annotated example / starting point |
| `KTH_logo_RGB_bla.png` | KTH logo (blue, PNG) — place next to your `.tex` file |

## Quick start

```latex
\documentclass[english, 11pt]{kth-document}

\title{My Document}
\subtitle{An optional subtitle}
\doctype{Activity Report}
\author{Firstname Lastname}
\affiliation{School of EECS, KTH}
\date{\today}
\version{1.0}          % optional
\shorttitle{My Doc}    % shown in header on pages 2+

\begin{document}
\maketitle
...
\end{document}
```

Compile with `pdflatex` (recommended) or `lualatex`/`xelatex` for exact KTH fonts.

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
