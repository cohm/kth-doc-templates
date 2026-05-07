# Build PDFs for the docs/ directory using the kth-doc-templates submodule.
#
# Layout assumed:
#   docs/
#     .templates/      -- git submodule of kth-doc-templates
#     Makefile         -- this file
#     report.md        -- markdown source
#     report.tex       -- LaTeX source
#
# Targets:
#   make            build both PDFs
#   make md         build report-md.pdf from report.md
#   make tex        build report-tex.pdf from report.tex
#   make clean      remove build artefacts

TEMPLATES := .templates
LATEX ?= pdflatex

# The selected LaTeX engine sees the class file and logo via TEXINPUTS — no
# path prefix needed
# in \documentclass{kth-document} or \kthlogopath.
TEXINPUTS_PREFIX := .:$(TEMPLATES):

# Markdown source files in this directory
MD_SOURCES  := $(wildcard *.md)
TEX_SOURCES := $(wildcard *.tex)

MD_PDFS  := $(MD_SOURCES:.md=-md.pdf)
TEX_PDFS := $(TEX_SOURCES:.tex=-tex.pdf)

.PHONY: all md tex clean
all: md tex
md:  $(MD_PDFS)
tex: $(TEX_PDFS)

# ----- Markdown ----------------------------------------------------------- #
# md-to-pdf writes <stem>.pdf next to the source; we rename to <stem>-md.pdf
# to keep the LaTeX and Markdown outputs from colliding.
%-md.pdf: %.md $(TEMPLATES)/md-to-pdf.css $(TEMPLATES)/md-to-pdf.json
	md-to-pdf $< \
	    --config-file $(TEMPLATES)/md-to-pdf.json \
	    --stylesheet  $(TEMPLATES)/md-to-pdf.css
	mv $*.pdf $@

# ----- LaTeX -------------------------------------------------------------- #
# Run the selected LaTeX engine twice for cross-references / TOC. -jobname controls the
# output stem so it doesn't clash with the markdown build.
%-tex.pdf: %.tex $(TEMPLATES)/kth-document.cls $(TEMPLATES)/KTH_logo_RGB_bla.png
	TEXINPUTS=$(TEXINPUTS_PREFIX) $(LATEX) -interaction=nonstopmode -jobname=$*-tex $<
	TEXINPUTS=$(TEXINPUTS_PREFIX) $(LATEX) -interaction=nonstopmode -jobname=$*-tex $<

clean:
	rm -f *.aux *.log *.out *.synctex.gz *-md.pdf *-tex.pdf
