import { readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

let html = await readFile('dist/index.html', 'utf8');
html = html.replace('<!--app-html-->', renderToString(<App />));
// A public origin is unknown until publishing. No invented deployment address.
// Supply SITE_URL to emit absolute preview URLs for Telegram / X crawlers.
if (process.env.SITE_URL) {
  const base = new URL(process.env.SITE_URL);
  if (!['http:', 'https:'].includes(base.protocol) || base.search || base.hash) {
    throw new Error('SITE_URL must be an HTTP(S) directory URL without query or fragment.');
  }
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  html = html.replaceAll('content="./assets/social.png"', `content="${escape(new URL('assets/social.png', base).href)}"`);
  html = html.replace('</head>', `<meta property="og:url" content="${escape(base.href)}" />\n  </head>`);
}
await writeFile('dist/index.html', html);
console.log('Prerendered complete page into dist/index.html.');
