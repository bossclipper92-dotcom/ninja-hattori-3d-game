#!/usr/bin/env node
/**
 * Local preview server with live reload.
 *
 *   npm run dev            → http://localhost:8080
 *   PORT=3000 npm run dev  → pick another port
 *
 * Edit any file in /content, /assets/css, /assets/js or the templates in /scripts
 * and the site rebuilds and the browser refreshes by itself.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const HIDDEN = ['.git', 'node_modules', 'scripts', 'content', 'package.json', 'package-lock.json'];
const RELOAD_SNIPPET =
  '<script>try{new EventSource("/__reload").onmessage=function(){location.reload()}}catch(e){}</script>';

const clients = new Set();

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return null;
  const top = path.relative(ROOT, file).split(path.sep)[0];
  if (HIDDEN.includes(top)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) return path.join(file, 'index.html');
  if (!fs.existsSync(file) && !path.extname(file) && fs.existsSync(`${file}.html`)) return `${file}.html`;
  return file;
}

const server = http.createServer((req, res) => {
  const url = req.url || '/';
  if (url.startsWith('/__reload')) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let file;
  try {
    file = resolveFile(url);
  } catch {
    file = null;
  }
  let status = 200;
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    status = 404;
    file = path.join(ROOT, '404.html');
  }
  const ext = path.extname(file).toLowerCase();
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  };
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
      return;
    }
    if (ext === '.html') data = Buffer.from(data.toString('utf8').replace('</body>', `${RELOAD_SNIPPET}</body>`));
    res.writeHead(status, headers);
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});

// ---- rebuild on change ------------------------------------------------------
// Every rebuild runs `node scripts/build.mjs` as a fresh process, so edited templates are always picked up.
function runBuild() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts', 'build.mjs')], { stdio: 'inherit' });
    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });
}

let timer;
let building = false;
let again = false;
async function rebuild(reason) {
  if (building) {
    again = true;
    return;
  }
  building = true;
  try {
    console.log(`\n↻ ${reason} — rebuilding…`);
    const ok = await runBuild();
    if (ok) for (const c of clients) c.write('data: reload\n\n');
  } finally {
    building = false;
    if (again) {
      again = false;
      rebuild('more changes');
    }
  }
}
function watch(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return;
  fs.watch(abs, (event, name) => {
    if (!name || name.startsWith('.')) return;
    clearTimeout(timer);
    timer = setTimeout(() => rebuild(`${dir}/${name} changed`), 150);
  });
}

if (!(await runBuild())) {
  console.error('The preview will start anyway. Fix the problem above and save to rebuild.\n');
}
['content', 'assets/css', 'assets/js', 'scripts/templates', 'scripts/lib'].forEach(watch);

server.listen(PORT, HOST, () => {
  console.log(`\n  Achieve Aboard preview running:  http://localhost:${PORT}\n  (press Ctrl+C to stop)\n`);
});
