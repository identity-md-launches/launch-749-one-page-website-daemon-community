// Minimal strict static server for checking the export beneath /preview/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!path.startsWith('/preview/')) throw new Error('Not found');
    const file = resolve(root, path.slice('/preview/'.length) || 'index.html');
    if (!file.startsWith(root + sep)) throw new Error('Not found');
    const data = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.listen(4173, '0.0.0.0', () => console.log('Export preview: http://localhost:4173/preview/'));
if (process.argv.includes('--bounded')) setTimeout(() => server.close(), 900_000).unref();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
