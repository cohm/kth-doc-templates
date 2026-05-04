# Consumer example

This directory shows the recommended pattern for using
[`kth-doc-templates`](https://github.com/kth/kth-doc-templates) inside
another package.

## Layout

```
your-package/
└── docs/
    ├── .templates/      ← git submodule of kth-doc-templates
    ├── Makefile         ← thin wrapper that wires up paths
    ├── report.md        ← Markdown source (uses md-to-pdf)
    └── report.tex       ← or LaTeX source (uses pdflatex)
```

## Setup in your own package

```bash
cd your-package
git submodule add https://github.com/kth/kth-doc-templates docs/.templates
cp docs/.templates/consumer-example/docs/Makefile docs/Makefile
```

Write your `docs/report.md` or `docs/report.tex`, then:

```bash
cd docs && make            # builds report-md.pdf and/or report-tex.pdf
```

## How the paths resolve

**LaTeX.** The Makefile sets `TEXINPUTS=.:.templates:` so `pdflatex` finds
`kth-document.cls` and the logo inside the submodule. Your `.tex` source
keeps using `\documentclass{kth-document}` with no path prefix.

**Markdown.** `md-to-pdf` is invoked with `--config-file
.templates/md-to-pdf.json --stylesheet .templates/md-to-pdf.css`. References
to the logo in your `.md` use the explicit path
`![](.templates/KTH_logo_RGB_bla.png)` since md-to-pdf resolves images
relative to the source file.

## Updating the templates

```bash
cd docs/.templates && git pull origin main
cd ../.. && git add docs/.templates && git commit -m "Update doc templates"
```
