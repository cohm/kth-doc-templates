// kth-reveal.js — shared runtime for the KTH reveal.js template.
//
// Drops the KTH master chrome (logo, footer, line pattern) onto every
// slide, mirrors data-state to the slide-background div so the per-variant
// background colours in kth-reveal.css apply, auto-fits long slide titles
// so they don't wrap to two lines, and renders inline KaTeX math when
// KaTeX is available.
//
// Usage in a consumer deck (place after the reveal.js CDN script tag and
// before the inline <script> that calls Reveal.initialize):
//
//   <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.2.1/dist/reveal.js"></script>
//   <script src="kth-reveal.js"></script>
//   <script>
//     Reveal.initialize({ /* deck-specific config */ });
//     // ...deck-specific demo code, if any...
//   </script>
//
// All public helpers are also exposed under window.KthReveal so they can
// be re-invoked after a deck dynamically adds slides — e.g.
// KthReveal.injectMasterChrome() to redo logos and footers.

(function () {
  'use strict';

  // --------------------------------------------------------------------- //
  // KTH line pattern (linjemönster) geometry — Brand guidelines pp. 23-28. //
  //                                                                       //
  // The 1920×1080 master pattern is split into four corner groups so each //
  // .kth-pattern instance can render just one corner's paths. That keeps  //
  // the visible motif aligned to the slide edges (rather than smearing    //
  // orphan path fragments through the middle when clipped). Authors can   //
  // also request "full" to get all six paths at once (the old behavior).  //
  //                                                                       //
  // Inlining (as opposed to an external .svg) lets stroke="currentColor"  //
  // inherit from the wrapping div's CSS `color`, so the brand palette     //
  // stays in CSS — and there's no file:// fetch for the SVG, which was   //
  // flaky as `mask-image` / via `<object>` across browsers.               //
  // --------------------------------------------------------------------- //
  const KTH_PATTERN_PATHS = {
    tl: [
      '<polyline points="-5.5 213.5 213.5 213.5 -4.5 648.5"/>',
      '<path d="m426.12-6.5v221.57c0,117.04-94.88,211.93-211.93,211.93H-5.5"/>',
    ],
    tr: [
      '<path d="m1066.04-3v429.38c-117.11,0-212.04-94.93-212.04-212.04h1067.5"/>',
      '<path d="m1493,0c0,235.83,191.17,427,427,427"/>',
    ],
    bl: [
      '<path d="m427.13,1080.31c0-124.95-101.29-226.25-226.25-226.25H-4.5"/>',
    ],
    br: [
      '<polyline points="1925.5 853.91 1492.84 853.91 1279.82 640 1279.82 1067 1708.29 640 1925.89 640"/>',
    ],
  };

  function kthPatternSvg(source) {
    const paths = source === 'full'
      ? Object.values(KTH_PATTERN_PATHS).flat()
      : (KTH_PATTERN_PATHS[source] || []);
    return '<svg viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">' +
           paths.join('') +
           '</svg>';
  }

  // --------------------------------------------------------------------- //
  // Master chrome injector                                                //
  //                                                                       //
  // Inserts a logo (and footer where appropriate) into every section,    //
  // sized and positioned per the slide variant. Done in JS so each PDF   //
  // page gets its own self-contained chrome — body-class-based selectors //
  // would only style the currently-active slide and miss the rest in     //
  // print-pdf mode.                                                       //
  // --------------------------------------------------------------------- //
  function injectMasterChrome() {
    const reveal = document.querySelector('.reveal');
    if (!reveal) return;
    const author   = reveal.dataset.kthAuthor             || '';
    const affShort = reveal.dataset.kthAffiliationShort   || '';
    // Footer renders "Name (Aff)" — short affiliation in parentheses right
    // after the name. The long form (data-kth-institute) drives the cover
    // meta paragraph instead.
    const namePlusAff = author + (affShort ? ' (' + affShort + ')' : '');
    const sections = document.querySelectorAll('.reveal .slides > section');
    const total = sections.length;
    sections.forEach((section, i) => {
      const state = section.dataset.state;
      const idx = i + 1;

      // Linjemönster — KTH brand line pattern (Brand guidelines pp. 23-28).
      // Opt-in via data-pattern, whose value is a comma-separated list of
      // pattern instances. Each instance is space-separated tokens:
      //
      //   <source> [transform...]
      //
      // where <source> is the corner-paths group to render
      // (tl | tr | bl | br | full), and transforms compose:
      // (rotate-180 | mirror-x | mirror-y). The transform is applied to
      // the inner <svg>, so e.g. "bl mirror-x" renders only the BL paths
      // (just path 2) and mirrors them horizontally — landing the
      // bottom-left content in the slide's bottom-right with the curve's
      // straight sides still flush against the slide edges.
      //
      // Examples:
      //   data-pattern="tl, bl mirror-x"  cover-style: TL natural + BL→BR
      //   data-pattern="tl, br"           content-slide style: TL + BR
      //   data-pattern="full"             full-bleed (the old default)
      //   data-pattern (no value)         shorthand for "full"
      //
      // Stroke colour from data-pattern-color (skyblue|blue|navy|lightblue
      // |sand|white|digitalblue), defaulting to skyblue and shared by all
      // instances on the section.
      if (section.hasAttribute('data-pattern')) {
        const spec   = (section.getAttribute('data-pattern') || '').toLowerCase().trim();
        const colour = (section.dataset.patternColor || 'skyblue').toLowerCase();
        const SOURCES = ['tl', 'tr', 'bl', 'br', 'full'];
        const XFORMS  = ['rotate-180', 'mirror-x', 'mirror-y'];
        const items = spec ? spec.split(',').map(s => s.trim()).filter(Boolean) : ['full'];
        for (const item of items) {
          const tokens = item.split(/\s+/);
          const source = tokens.find(t => SOURCES.includes(t)) || 'full';
          const cls = ['kth-pattern', colour];
          for (const t of tokens) {
            if (XFORMS.includes(t)) cls.push(t);
          }
          section.insertAdjacentHTML('afterbegin',
            '<div class="' + cls.join(' ') + '">' + kthPatternSvg(source) + '</div>');
        }
      }

      if (state === 'cover') {
        section.insertAdjacentHTML('afterbegin',
          '<img class="kth-cover-logo" src="KTH_logo_RGB_bla.svg" alt="KTH">');
      } else if (state === 'closing') {
        section.insertAdjacentHTML('afterbegin',
          '<img class="kth-closing-logo" src="KTH_logo_RGB_bla.svg" alt="KTH">');
      } else if (state === 'divider') {
        // Dividers get the small logo in the corner but no footer — they're
        // section-break slides, not numbered content.
        section.insertAdjacentHTML('afterbegin',
          '<img class="kth-page-logo" src="KTH_logo_RGB_bla.svg" alt="KTH">');
      } else {
        section.insertAdjacentHTML('afterbegin',
          '<img class="kth-page-logo" src="KTH_logo_RGB_bla.svg" alt="KTH">' +
          '<div class="kth-page-footer">' +
            '<span class="left">'  + namePlusAff + '</span>' +
            '<span class="center">' + idx + ' / ' + total + '</span>' +
            '<span class="right"></span>' +
          '</div>');
      }
    });
  }

  // --------------------------------------------------------------------- //
  // Reveal v5 does NOT mirror data-state to the generated .slide-         //
  // background div, so we sync that here for the per-variant background   //
  // colours defined in kth-reveal.css.                                    //
  // --------------------------------------------------------------------- //
  function mirrorStateToBackgrounds() {
    document.querySelectorAll('.reveal .slides section').forEach((slide) => {
      const state = slide.dataset.state;
      const bg    = slide.slideBackgroundElement;
      if (!bg) return;
      if (state) bg.dataset.state = state;
      else       delete bg.dataset.state;
    });
  }

  // --------------------------------------------------------------------- //
  // Auto-fit slide titles                                                 //
  //                                                                       //
  // If an <h1> would wrap onto a second line, shrink its font-size so it //
  // fits on one line. Detection is by rendered height (actual height vs //
  // current line-height) so we catch wrapping that pure width math would //
  // miss to font-metric rounding. The first pass scales proportionally   //
  // from a no-wrap scrollWidth measurement; if the title still wraps     //
  // (rare, but happens when a long word forces a break), we iterate down //
  // 2 px at a time until it fits or hits the 56 px floor.                //
  // Re-runs on every slide change so auto-animated sibling slides — and  //
  // any title swapped in at runtime — are each sized independently.      //
  // --------------------------------------------------------------------- //
  function fitTitle(h) {
    h.style.fontSize = '';
    let fs = parseFloat(window.getComputedStyle(h).fontSize);
    function currentLineHeight() {
      const v = parseFloat(window.getComputedStyle(h).lineHeight);
      return Number.isFinite(v) ? v : fs * 1.2;
    }
    function fitsOneLine() {
      // 1.3 × line-height to absorb descenders and rounding without
      // misclassifying a tight single line as a wrap.
      return h.getBoundingClientRect().height <= currentLineHeight() * 1.3;
    }
    if (fitsOneLine()) return;

    // First-pass proportional scale from a no-wrap measurement.
    const prevWs = h.style.whiteSpace;
    h.style.whiteSpace = 'nowrap';
    const natural = h.scrollWidth;
    h.style.whiteSpace = prevWs;
    const avail = h.clientWidth;
    if (avail > 0 && natural > avail) {
      fs = Math.max(56, (avail * 0.96) / natural * fs);
      h.style.fontSize = fs + 'px';
    }

    // Iterative refinement: shrink until single-line or floor.
    while (fs > 56 && !fitsOneLine()) {
      fs = Math.max(56, fs - 2);
      h.style.fontSize = fs + 'px';
    }
  }
  function fitAllTitles() {
    document.querySelectorAll('.reveal .slides section h1').forEach(fitTitle);
  }
  function fitWhenReady() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitAllTitles);
    } else {
      fitAllTitles();
    }
  }

  // --------------------------------------------------------------------- //
  // KaTeX — render $…$ inline math after Reveal has laid out the slides. //
  // Walks the whole document.body in one pass (off-screen slides are     //
  // still in the DOM, so they get processed too). No-op if the consumer  //
  // didn't include the KaTeX <link>/<script> in their <head>.            //
  // --------------------------------------------------------------------- //
  function renderKatex() {
    if (typeof renderMathInElement !== 'function') return;
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true  },
        { left: '$',  right: '$',  display: false },
      ],
      throwOnError: false,
    });
  }

  // --------------------------------------------------------------------- //
  // Boot. injectMasterChrome touches the DOM directly, so defer until    //
  // DOMContentLoaded if loaded from <head>. Reveal handlers are queued  //
  // immediately and fire whenever Reveal becomes ready.                  //
  // --------------------------------------------------------------------- //
  function boot() {
    injectMasterChrome();
    if (typeof Reveal !== 'undefined') {
      Reveal.on('ready',        mirrorStateToBackgrounds);
      Reveal.on('slidechanged', mirrorStateToBackgrounds);
      Reveal.on('ready',        fitWhenReady);
      Reveal.on('slidechanged', fitWhenReady);
    }
    if (document.readyState === 'complete') renderKatex();
    else window.addEventListener('load', renderKatex);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Expose the helpers so consumers can re-invoke them after dynamically
  // adding slides or swapping titles in at runtime.
  window.KthReveal = {
    injectMasterChrome,
    mirrorStateToBackgrounds,
    fitTitle,
    fitAllTitles,
    fitWhenReady,
    renderKatex,
    kthPatternSvg,
  };
})();
