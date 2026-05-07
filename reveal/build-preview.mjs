#!/usr/bin/env node
/**
 * Build a first-slide PNG preview and a print-PDF export of the reveal.js deck.
 *
 * Outputs:
 *   docs/preview/example-reveal.png   (screenshot of the cover slide)
 *   example-reveal.pdf                (full deck via reveal's ?print-pdf mode)
 *
 * Spins up a tiny static HTTP server rooted at the repo root so that
 * sibling assets (KTH_logo_RGB_bla.png, widgets/*) resolve correctly.
 *
 * Run from the repo root:
 *   node reveal/build-preview.mjs
 *
 * Requires `puppeteer` to be installed (npm install --no-save puppeteer).
 */

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdir }    from 'node:fs/promises';
import { extname, resolve, normalize, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const REPO_ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const PORT = 8123;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
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
    await mkdir(resolve(REPO_ROOT, 'docs/preview'), { recursive: true });

    // ----- 1. Screenshot the cover slide ---------------------------------
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}/reveal/example.html`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    // Wait for fonts and the cover-slide entry animations to settle.
    await page.evaluate(() => document.fonts ? document.fonts.ready : null);
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({
      path: resolve(REPO_ROOT, 'docs/preview/example-reveal.png'),
      fullPage: false,
      omitBackground: false,
    });
    console.log('wrote docs/preview/example-reveal.png');
    await page.close();

    // ----- 2. Print-PDF export -------------------------------------------
    const pdfPage = await browser.newPage();
    await pdfPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
    await pdfPage.goto(`http://localhost:${PORT}/reveal/example.html?print-pdf`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });
    await pdfPage.evaluate(() => document.fonts ? document.fonts.ready : null);
    await new Promise(r => setTimeout(r, 2000));
    await pdfPage.pdf({
      path: resolve(REPO_ROOT, 'example-reveal.pdf'),
      width:  '1920px',
      height: '1080px',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
    await pdfPage.close();
    console.log('wrote example-reveal.pdf');

  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
