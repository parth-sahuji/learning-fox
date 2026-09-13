// ponytail: puppeteer here is build-time only (devDependency), never shipped to the browser bundle.
// Ceiling: hardcoded list of the 30 known public/marketing routes (mirrors sitemap.xml).
// Upgrade path: if routes become dynamic/user-generated, this stops scaling -> move to real SSR (Next/Remix) then.
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  '/', '/about', '/how-it-works', '/our-rules', '/locations',
  '/subjects/mathematics', '/subjects/science', '/subjects/english',
  '/locations/india/mumbai', '/locations/india/pune', '/locations/india/delhi',
  '/locations/india/bangalore', '/locations/india/hyderabad', '/locations/india/chennai',
  '/locations/india/kolkata', '/locations/india/ahmedabad',
  '/locations/usa/new-york', '/locations/usa/los-angeles', '/locations/uk/london',
  '/tutor-jobs/india/mumbai', '/tutor-jobs/india/pune', '/tutor-jobs/india/delhi',
  '/tutor-jobs/india/bangalore', '/tutor-jobs/india/hyderabad', '/tutor-jobs/india/chennai',
  '/tutor-jobs/india/kolkata', '/tutor-jobs/india/ahmedabad',
  '/tutor-jobs/usa/new-york', '/tutor-jobs/usa/los-angeles', '/tutor-jobs/uk/london',
];

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return; } catch { await new Promise(r => setTimeout(r, 500)); }
  }
  throw new Error('vite preview server never came up');
}

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'inherit' });
  try {
    await waitForServer(BASE);
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root > *', { timeout: 10000 }).catch(() => {});
      const html = await page.content();

      const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html);
      console.log('prerendered', route);
    }

    await browser.close();
  } finally {
    preview.kill();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
