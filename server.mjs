import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const environment = typeof process === "undefined" ? {} : process.env;
const port = Number(environment.PORT || 4173);
const host = environment.HOST || "127.0.0.1";
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".m4v": "video/mp4",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function send(response, status, body, headers = {}) {
  response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  response.end(body);
}

function requestedFile(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const documentPath = decoded === "/" ? "/index.html" : decoded;
  const target = resolve(root, `.${documentPath}`);
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return target === root || target.startsWith(rootPrefix) ? target : null;
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "Method not allowed");
    return;
  }

  let path;
  try {
    path = requestedFile(new URL(request.url, `http://${request.headers.host}`).pathname);
  } catch {
    send(response, 400, "Invalid path");
    return;
  }

  if (!path) {
    send(response, 403, "Forbidden");
    return;
  }

  let file;
  try {
    file = await stat(path);
  } catch {
    send(response, 404, "Not found");
    return;
  }

  if (!file.isFile()) {
    send(response, 404, "Not found");
    return;
  }

  const type = mimeTypes[extname(path).toLowerCase()] || "application/octet-stream";
  const range = request.headers.range;
  const commonHeaders = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
    "Content-Type": type
  };

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      send(response, 416, "Invalid range", { "Content-Range": `bytes */${file.size}` });
      return;
    }
    const hasStart = Boolean(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : file.size - 1;
    const start = hasStart ? Number(match[1]) : Math.max(file.size - requestedEnd, 0);
    const end = hasStart ? Math.min(requestedEnd, file.size - 1) : file.size - 1;
    if (start > end || start >= file.size) {
      send(response, 416, "Range not satisfiable", { "Content-Range": `bytes */${file.size}` });
      return;
    }
    response.writeHead(206, {
      ...commonHeaders,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${file.size}`
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(path, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, { ...commonHeaders, "Content-Length": file.size });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(path).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Portfolio running at http://${host}:${port}`);
});

export { server };
