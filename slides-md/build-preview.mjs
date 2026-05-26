#!/usr/bin/env node
/**
 * Build a print-PDF export of the markdown-driven reveal.js deck.
 *
 * Outputs:
 *   example-md-reveal.pdf   (full deck via reveal's ?print-pdf mode)
 *
 * Adapted from reveal/build-preview.mjs. Spins up a tiny static HTTP
 * server rooted at the repo root so that sibling assets
 * (KTH_logo_RGB_bla.svg, widgets/*, example.md itself) resolve over
 * HTTP — the reveal.js markdown plugin fetches example.md, which
 * fails over file:// in headless Chrome.
 *
 * Run from the repo root:
 *   node slides-md/build-preview.mjs
 *
 * Requires `puppeteer` to be installed (npm install --no-save puppeteer).
 */

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, normalize, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const REPO_ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = 8124;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
};

function serveStatic(rootDir, port) {
  const server = http.createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const safe = normalize(join(rootDir, urlPath));
      if (!safe.startsWith(rootDir)) {
        res.writeHead(403); res.end('forbidden'); return;
      }
      const target = safe.endsWith('/') ? join(safe, 'index.html') : safe;
      const data = await readFile(target);
      const mime = MIME[extname(target).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
      res.end(data);
    } catch (err) {
      res.writeHead(404); res.end(String(err.message || err));
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

async function main() {
  const server = await serveStatic(REPO_ROOT, PORT);
  console.log(`serving ${REPO_ROOT} on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // ----- Print-PDF export ----------------------------------------------
    const pdfPage = await browser.newPage();
    await pdfPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await pdfPage.goto(`http://localhost:${PORT}/slides-md/example.html?print-pdf`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await pdfPage.evaluate(() => document.fonts ? document.fonts.ready : null);
    // Extra slack on top of networkidle0: the markdown plugin fetches and
    // parses example.md, then kth-reveal.js injects chrome on the 'ready'
    // event. 2s is generous for both.
    await new Promise(r => setTimeout(r, 2000));
    await pdfPage.pdf({
      path: resolve(REPO_ROOT, 'example-md-reveal.pdf'),
      width:  '1920px',
      height: '1080px',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    await pdfPage.close();
    console.log('wrote example-md-reveal.pdf');

  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
