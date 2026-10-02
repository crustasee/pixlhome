const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function createServer() {
  return http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      response.writeHead(400);
      response.end('Invalid request path');
      return;
    }

    const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filePath = path.resolve(ROOT, relativePath);
    if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    if (relativePath.split(/[\\/]+/).some(segment => segment.startsWith('.'))) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    fs.realpath(filePath, (pathError, resolvedPath) => {
      if (pathError) {
        response.writeHead(404);
        response.end('Not found');
        return;
      }

      const pathFromRoot = path.relative(ROOT, resolvedPath);
      if (pathFromRoot === '..' || pathFromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(pathFromRoot)) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
      }

      fs.stat(resolvedPath, (statError, stats) => {
        if (statError || !stats.isFile()) {
          response.writeHead(404);
          response.end('Not found');
          return;
        }

        response.writeHead(200, {
          'Content-Length': stats.size,
          'Content-Type': MIME_TYPES[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream'
        });

        if (request.method === 'HEAD') {
          response.end();
          return;
        }

        const stream = fs.createReadStream(resolvedPath);
        stream.on('error', () => {
          if (!response.headersSent) response.writeHead(500);
          response.end('Error reading file');
        });
        stream.pipe(response);
      });
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080;
  const host = process.env.HOST || '127.0.0.1';
  createServer().listen(port, host, () => {
    console.log(`Homepage available at http://localhost:${port}/`);
  });
}

module.exports = { createServer };
