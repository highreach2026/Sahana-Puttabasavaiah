const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

const PORT = (process.argv.find(a => a.startsWith('--port=')) || '').split('=')[1] || process.env.PORT || 5000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Local MetForm submission & view counter handlers
  if (pathname.includes('/wp-json/metform/v1/forms/views/')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ views: 1 }));
    return;
  }
  if (pathname.includes('/wp-json/sahana/v1/noop')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (req.method === 'POST' && pathname.includes('/wp-json/metform/v1/entries/insert')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        status: 1,
        store_entries: 1,
        data: { message: 'Thank you for contacting Sahana Puttabasavaiah! Your enquiry has been recorded locally. For direct response call +91 96112 75553 or email sahanap08@gmail.com.' }
      }));
    });
    return;
  }

  // Normalize path
  let filePath = path.join(ROOT, pathname);

  // Prevent path traversal outside root
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if directory
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (e) {}

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (pathname.includes('/elementor/assets/js/chunks/') && pathname.endsWith('.js')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end('/* optional elementor chunk */');
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}`;
  console.log('====================================================');
  console.log(` Web server running at: ${url}`);
  console.log(` Serving folder: ${ROOT}`);
  console.log(' Press Ctrl + C to stop the server');
  console.log('====================================================');

  // Automatically open browser on Windows unless NO_OPEN=1 or --no-open
  if (!process.env.NO_OPEN && !process.argv.includes('--no-open')) exec(`start ${url}`);
});
