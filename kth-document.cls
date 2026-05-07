%% kth-document.cls — KTH Professional Document Template
%% Follows the KTH Graphical Profile (updated September 2023)
%%
%% Usage: \documentclass[options]{kth-document}
%%
%% Options:
%%   english     — English locale (default): babel, date format, no decimal comma
%%   swedish     — Swedish locale: babel, icomma decimal comma
%%   titlepage   — full title page instead of inline title block
%%   twocolumn   — two-column body (passed to article)
%%   Any other option is passed to the article class.
%%
%% Compile with: pdflatex (recommended) or xelatex/lualatex
%% For exact KTH fonts (Figtree), compile with xelatex or lualatex
%% and ensure Figtree is installed (available free on Google Fonts).

\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{kth-document}[2026/04/18 v1.0 KTH Professional Document]

% --------------------------------------------------------------------------
% Options
% --------------------------------------------------------------------------
\newif\if@kthtitlepage \@kthtitlepagefalse
\DeclareOption{titlepage}{\@kthtitlepagetrue}

\newif\if@kthswedish \@kthswedishfalse
\DeclareOption{swedish}{\@kthswedishtrue}
\DeclareOption{english}{}  % default — no flag needed

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ExecuteOptions{11pt}   % default size; overridden if user passes 10pt/11pt/12pt
\ProcessOptions\relax

\LoadClass[a4paper]{article}  % size option arrives via PassOptionsToClass above

% --------------------------------------------------------------------------
% Engine detection for font loading
% --------------------------------------------------------------------------
\RequirePackage{iftex}

% --------------------------------------------------------------------------
% Locale — controls hyphenation, date formatting, decimal separator
% --------------------------------------------------------------------------
\if@kthswedish
  \RequirePackage[swedish]{babel}
  \RequirePackage{icomma}          % decimal comma: 3,14 instead of 3.14
\else
  \RequirePackage[english]{babel}
\fi
\RequirePackage{csquotes}          % smart quotes that respect the active language

% --------------------------------------------------------------------------
% Core layout
% --------------------------------------------------------------------------
\RequirePackage[
  a4paper,
  top=2.9cm, bottom=2.9cm,  % page 2+ margins; page 1 is offset by \vspace* in \maketitle
  left=2.8cm, right=2.8cm,
  headheight=1.0cm,
  headsep=0.4cm,
  footskip=1.4cm
]{geometry}

% --------------------------------------------------------------------------
% Fonts
% --------------------------------------------------------------------------
\ifXeTeX
  \RequirePackage{fontspec}
  % Figtree (KTH heading font) — install from Google Fonts or KTH Software Center
  % Falls back to a clean sans-serif if not installed.
  \IfFontExistsTF{Figtree}{
    \newfontfamily\headingfont{Figtree}[BoldFont={Figtree SemiBold}]
  }{
    \newfontfamily\headingfont{TeX Gyre Heros}
  }
  % Georgia (KTH body font) — pre-installed on most systems
  \IfFontExistsTF{Georgia}{
    \setmainfont{Georgia}
  }{} % keep default if missing
  \newcommand{\sfheading}{\headingfont}
\else\ifLuaTeX
  \RequirePackage{fontspec}
  % Figtree is distributed as a variable font (wght axis).
  % LuaLaTeX uses HarfBuzz to request axis weights directly from the
  % installed family.
  \IfFontExistsTF{Figtree}{
    \newfontfamily\headingfont{Figtree}[
      Renderer     = HarfBuzz,
      RawFeature   = {axis={wght:400}},             % upright weight
      BoldFont     = Figtree,
      BoldFeatures = {RawFeature={axis={wght:600}}} % SemiBold for \bfseries
    ]
  }{
    \newfontfamily\headingfont{TeX Gyre Heros}
  }
  \IfFontExistsTF{Georgia}{
    \setmainfont{Georgia}
  }{}
  \newcommand{\sfheading}{\headingfont}
\else
  % pdfLaTeX fallback: TeX Gyre Heros (Helvetica clone) for headings,
  % TeX Gyre Pagella (Palatino) for body — both freely available in TeX Live.
  \RequirePackage[T1]{fontenc}
  \RequirePackage[utf8]{inputenc}
  \RequirePackage{tgheros}    % Helvetica-like sans, used for headings
  \RequirePackage{tgpagella}  % Palatino-like serif, used for body
  \RequirePackage{microtype}
  \newcommand{\sfheading}{\sffamily}
\fi\fi

% --------------------------------------------------------------------------
% Colors  (KTH Grafisk manual v1.2, 2024)
% --------------------------------------------------------------------------
\RequirePackage{xcolor}

% Primary palette
\definecolor{kthwhite}{HTML}{FFFFFF}
\definecolor{kthsand}{HTML}{EBE5E0}
\definecolor{kthblue}{HTML}{004791}      % KTH brand blue — used in logo
\definecolor{kthskyblue}{HTML}{6298D2}
\definecolor{kthnavy}{HTML}{000061}      % Navy — used in logo wreath
\definecolor{kthlightblue}{HTML}{DEF0FF}
\definecolor{kthdigitalblue}{HTML}{0029ED} % Screen only; use kthblue for print

% Functional palette — each family has dark / mid / light variants
% Named kth{dark,<empty>,light}{color}
\definecolor{kthdarkgreen}{HTML}{0D4A21}
\definecolor{kthgreen}{HTML}{4DA060}
\definecolor{kthlightgreen}{HTML}{C7EBBA}

\definecolor{kthdarkteal}{HTML}{1C434C}
\definecolor{kthteal}{HTML}{339C9C}
\definecolor{kthlightteal}{HTML}{B2E0E0}

\definecolor{kthdarkbrick}{HTML}{78001A}
\definecolor{kthbrick}{HTML}{E86A58}
\definecolor{kthlightbrick}{HTML}{FFCCC4}

\definecolor{kthdarkyellow}{HTML}{A65900}
\definecolor{kthyellow}{HTML}{FFBE00}
\definecolor{kthlightyellow}{HTML}{FFF0B0}

\definecolor{kthdarkgray}{HTML}{323232}
\definecolor{kthgray}{HTML}{A5A5A5}
\definecolor{kthlightgray}{HTML}{E6E6E6}
\colorlet{kthdarkgrey}{kthdarkgray}      % British spelling aliases
\colorlet{kthgrey}{kthgray}
\colorlet{kthlightgrey}{kthlightgray}

\definecolor{kthbrokenblack}{HTML}{212121} % Web body text on white
\definecolor{kthbrokenwhite}{HTML}{FCFCFC} % Web body text on dark

% Convenient aliases
\colorlet{kthaccent}{kthblue}
\colorlet{kthmuted}{kthsand}

% --------------------------------------------------------------------------
% Graphics & hyperlinks
% --------------------------------------------------------------------------
\RequirePackage{graphicx}
\RequirePackage[
  colorlinks=true,
  linkcolor=kthblue,
  urlcolor=kthblue,
  citecolor=kthblue,
  pdfborder={0 0 0}
]{hyperref}

% --------------------------------------------------------------------------
% Logo helper
% Looks for kth-logo.pdf, kth-logo.png, kth-logo.eps in that order.
% If none found, falls back to a typeset "KTH" in brand blue.
% Place your logo file next to the .tex file or set \kthlogopath.
% --------------------------------------------------------------------------
\newcommand{\kthlogopath}{KTH_logo_RGB_bla}  % filename without extension
\newcommand{\kthlogoheight}{2cm}    % adjust to taste

\newcommand{\@kthlogo}{%
  \IfFileExists{\kthlogopath.pdf}{%
    \includegraphics[height=\kthlogoheight]{\kthlogopath.pdf}%
  }{%
    \IfFileExists{\kthlogopath.png}{%
      \includegraphics[height=\kthlogoheight]{\kthlogopath.png}%
    }{%
      \IfFileExists{\kthlogopath.eps}{%
        \includegraphics[height=\kthlogoheight]{\kthlogopath.eps}%
      }{%
        % Silent fallback: reserve vertical space but show nothing.
        % Place kth-logo.pdf/.png/.eps next to your .tex file to show logo.
        \rule{0pt}{\kthlogoheight}%
      }%
    }%
  }%
}

% --------------------------------------------------------------------------
% Header / Footer
% --------------------------------------------------------------------------
\RequirePackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}

% Short title in header (set with \shorttitle{}); logo is on first page only
\newcommand{\@shorttitle}{}
\newcommand{\shorttitle}[1]{\gdef\@shorttitle{#1}}

\fancyhead[L]{%
  \small\sfheading\color{kthblue!70}%
  \if\relax\detokenize{\@shorttitle}\relax\else\@shorttitle\fi
}

% Blue rule below header
\renewcommand{\headrule}{{\color{kthblue}\rule{\headwidth}{1.2pt}}}
\renewcommand{\headrulewidth}{1.2pt}

% Centered page number in footer
\fancyfoot[C]{\small\sfheading\textcolor{black!45}{\thepage}}
\renewcommand{\footrulewidth}{0pt}

% Plain style for title page
\fancypagestyle{plain}{%
  \fancyhf{}%
  \renewcommand{\headrule}{}%
  \renewcommand{\headrulewidth}{0pt}%
  \fancyfoot[C]{\small\sfheading\textcolor{black!45}{\thepage}}%
}

% --------------------------------------------------------------------------
% Proportional heading sizes
% All heading and title sizes are expressed as multiples of the document's
% base font size (\f@size, set by the class option: 10pt, 11pt, 12pt, …).
% \strip@pt converts a \dimen register to a plain number for \fontsize.
% --------------------------------------------------------------------------
\newdimen\kth@basesize          % document base size (captured at begin-doc)
\newdimen\kth@secsize           % \section:      1.25× base
\newdimen\kth@secleading        %                1.50× base
\newdimen\kth@subsecsize        % \subsection:   1.10× base
\newdimen\kth@subsecleading     %                1.32× base
\newdimen\kth@titlesize         % inline title:  1.65× base  (~18pt at 11pt)
\newdimen\kth@titleleading      %                1.98× base
\newdimen\kth@titlepgsize       % titlepage:     2.20× base  (~24pt at 11pt)
\newdimen\kth@titlepgleading    %                2.64× base

\AtBeginDocument{%
  \kth@basesize=\f@size pt\relax
  \kth@secsize=1.25\kth@basesize      \kth@secleading=1.50\kth@basesize
  \kth@subsecsize=1.10\kth@basesize   \kth@subsecleading=1.32\kth@basesize
  \kth@titlesize=1.65\kth@basesize    \kth@titleleading=1.98\kth@basesize
  \kth@titlepgsize=2.20\kth@basesize  \kth@titlepgleading=2.64\kth@basesize
}

% --------------------------------------------------------------------------
% Section headings — KTH blue, sans-serif, proportional sizes
% --------------------------------------------------------------------------
\RequirePackage{titlesec}

\titleformat{\section}
  {\sfheading\bfseries\color{kthblue}%
   \fontsize{\strip@pt\kth@secsize}{\strip@pt\kth@secleading}\selectfont}
  {}  % no number prefix — add {{\thesection\quad}} here to re-enable
  {0em}
  {}
  [{\color{kthblue!40}\vspace{1pt}\hrule height 0.5pt\vspace{0pt}}]

\titleformat{\subsection}
  {\sfheading\bfseries\color{kthblue!85}%
   \fontsize{\strip@pt\kth@subsecsize}{\strip@pt\kth@subsecleading}\selectfont}
  {}
  {0em}
  {}

\titleformat{\subsubsection}
  {\sfheading\normalsize\itshape\color{black!70}}
  {}
  {0em}
  {}

\titlespacing*{\section}      {0pt}{2.0ex plus 0.6ex minus 0.2ex}{0.8ex plus 0.2ex}
\titlespacing*{\subsection}   {0pt}{1.4ex plus 0.4ex minus 0.1ex}{0.4ex}
\titlespacing*{\subsubsection}{0pt}{1.0ex plus 0.3ex minus 0.1ex}{0.2ex}

% Sections are numbered internally (so hyperref anchors are unique) but
% numbers are not displayed — the title formats above omit \thesection.
% To show numbers, add {\thesection\quad} to the format's label argument.
\setcounter{secnumdepth}{3}

% --------------------------------------------------------------------------
% Paragraph spacing — airy feel
% --------------------------------------------------------------------------
\RequirePackage{parskip}
\setlength{\parskip}{0.6em}
\setlength{\parindent}{0pt}

% --------------------------------------------------------------------------
% Additional document metadata
% --------------------------------------------------------------------------
\newcommand{\@subtitle}{}
\newcommand{\subtitle}[1]{\gdef\@subtitle{#1}}

\newcommand{\@doctype}{}
\newcommand{\doctype}[1]{\gdef\@doctype{#1}}

\newcommand{\@affiliation}{}
\newcommand{\affiliation}[1]{\gdef\@affiliation{#1}}

\newcommand{\@version}{}
\newcommand{\version}[1]{\gdef\@version{#1}}

% Helper: prints date + optional version "(v X.Y)"
\newcommand{\@dateline}{%
  \@date%
  \if\relax\detokenize\expandafter{\@version}\relax\else
    \ \textcolor{black!40}{(v\@version)}%
  \fi
}

% --------------------------------------------------------------------------
% Title block  (inline, at top of first page)
% --------------------------------------------------------------------------
\newcommand{\@titlerule}[1][1.8pt]{{\color{kthblue}\rule{\linewidth}{#1}}}

\if@kthtitlepage
  % ---- Full title page ----
  \renewcommand{\maketitle}{%
    \begin{titlepage}
      \thispagestyle{empty}
      \vspace*{1cm}
      \noindent\@kthlogo
      \vspace{1cm}

      \noindent\@titlerule[2pt]
      \vspace{1.8cm}

      \noindent
      {\sfheading\bfseries\fontsize{\strip@pt\kth@titlepgsize}{\strip@pt\kth@titlepgleading}\selectfont\color{kthblue}\@title\par}

      \if\relax\detokenize\expandafter{\@subtitle}\relax\else
        \vspace{0.5cm}
        {\sfheading\large\color{kthblue!70}\@subtitle\par}
      \fi

      \if\relax\detokenize\expandafter{\@doctype}\relax\else
        \vspace{0.4cm}
        {\sfheading\normalsize\textcolor{black!55}\@doctype\par}
      \fi

      \vspace{1.4cm}
      \noindent\@titlerule[0.6pt]
      \vspace{0.8cm}

      {\normalsize\@author\par}
      \if\relax\detokenize\expandafter{\@affiliation}\relax\else
        \vspace{0.2cm}
        {\small\textcolor{black!60}\@affiliation\par}
      \fi
      \vspace{0.4cm}
      {\small\textcolor{black!50}\@dateline\par}

      \vfill
      \noindent\@titlerule[0.6pt]
    \end{titlepage}%
    \setcounter{page}{1}%
  }
\else
  % ---- Inline title block (default) ----
  \renewcommand{\maketitle}{%
    \thispagestyle{empty}%
    \vspace*{-0.7cm}%  pull title up to compensate for the larger page-2+ top margin
    {\noindent\@kthlogo}
    \vspace{0.35cm}

    {\noindent\sfheading\bfseries\fontsize{\strip@pt\kth@titlesize}{\strip@pt\kth@titleleading}\selectfont\color{kthblue}\@title\par}

    \if\relax\detokenize\expandafter{\@subtitle}\relax\else
      \vspace{0.2cm}
      {\sfheading\large\color{kthblue!75}\@subtitle\par}
    \fi

    \if\relax\detokenize\expandafter{\@doctype}\relax\else
      \vspace{0.15cm}
      {\sfheading\small\textcolor{black!55}\@doctype\par}
    \fi

    \vspace{0.35cm}
    {\small\@author%
      \if\relax\detokenize\expandafter{\@affiliation}\relax\else
        \ \textcolor{black!50}{---}\ \textcolor{black!60}\@affiliation%
      \fi
      \hfill\textcolor{black!50}\@dateline\par}

    \vspace{0.15cm}
    \noindent\@titlerule[0.6pt]
    \vspace{0.15cm}

    % Switch to normal page style for subsequent pages
    \thispagestyle{empty}%
    \aftergroup\@switchtofancy
  }

  % Activate fancy headers from page 2 onward
  \newcommand{\@switchtofancy}{\pagestyle{fancy}}
\fi

% --------------------------------------------------------------------------
% Useful extras
% --------------------------------------------------------------------------

% Highlighted info box
\RequirePackage{mdframed}
\newmdenv[
  backgroundcolor=kthlightblue,
  linecolor=kthblue,
  linewidth=1pt,
  leftmargin=0pt, rightmargin=0pt,
  innerleftmargin=10pt, innerrightmargin=10pt,
  innertopmargin=8pt, innerbottommargin=8pt,
  skipabove=\parskip, skipbelow=\parskip
]{kthbox}

% Sand-colored note box
\newmdenv[
  backgroundcolor=kthsand,
  linecolor=kthblue!30,
  linewidth=0.8pt,
  leftmargin=0pt, rightmargin=0pt,
  innerleftmargin=10pt, innerrightmargin=10pt,
  innertopmargin=8pt, innerbottommargin=8pt,
  skipabove=\parskip, skipbelow=\parskip
]{kthnotebox}

% Inline keyword highlight
\newcommand{\kthhl}[1]{\textcolor{kthblue}{\textbf{#1}}}
