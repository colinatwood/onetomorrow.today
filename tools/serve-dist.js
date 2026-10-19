#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8" };

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const candidates = [requested, `${requested}.html`, path.join(requested, "index.html")];
  const file = candidates.map(candidate => path.resolve(root, candidate)).find(candidate => candidate.startsWith(root + path.sep) && fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  const selected = file || path.join(root, "404.html");
  response.statusCode = file ? 200 : 404;
  response.setHeader("content-type", types[path.extname(selected)] || "application/octet-stream");
  fs.createReadStream(selected).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Serving dist on http://127.0.0.1:${port}`));
