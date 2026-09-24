// ponytail: pure Node + already-installed Vite/React SSR, no headless browser (Chromium doesn't reliably launch in
// Vercel's build container - see libnspr4.so failures). Location/tutor-jobs routes are generated from locations.js;
// the remaining marketing routes are hardcoded (mirror sitemap.xml, keep in sync manually). Ceiling: still a fixed
// route list overall. Upgrade path: if routes go dynamic/user-generated, this stops scaling -> real SSR framework
// (Next/Remix) then.
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { locations } from '../src/data/locations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const ROUTES = [
  '/', '/about', '/how-it-works', '/our-rules', '/locations',
  '/subjects/mathematics', '/subjects/science', '/subjects/english',
  ...locations.map(l => `/locations/${l.countrySlug}/${l.slug}`),
  ...locations.map(l => `/tutor-jobs/${l.countrySlug}/${l.slug}`),
];

execSync('npx vite build --ssr src/entry-server.jsx --outDir dist-ssr', { cwd: ROOT, stdio: 'inherit' });

const { render } = await import(join(ROOT, 'dist-ssr', 'entry-server.js'));
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const route of ROUTES) {
  const { html: appHtml, helmet } = render(route);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  // Pages without their own <Helmet> (home/about) leave these empty - default head stays as-is.
  const title = helmet.title.toString();
  if (/<title[^>]*>[^<]+<\/title>/.test(title)) html = html.replace(/<title>[\s\S]*?<\/title>/, title);
  const metaDesc = helmet.meta.toString();
  if (metaDesc) html = html.replace(/<meta name="description"[^>]*\/?>/, metaDesc);
  const jsonLd = helmet.script.toString();
  if (jsonLd) html = html.replace('</head>', `${jsonLd}\n  </head>`);

  const outPath = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log('prerendered', route);
}
