/**
 * Preloaded with `node --require` ahead of the Next server. It exists for one
 * reason: to switch off Node's `server.requestTimeout`.
 *
 * That setting caps the time allowed to receive an *entire* request — 300 s by
 * default since Node 18 — and Next never assigns it, so the default stands.
 * `POST /api/admin/site-config/restore` takes the whole backup archive as one
 * raw body, currently ~7.5 GB, which no realistic uplink pushes in five
 * minutes. At 300 s Node destroys the socket mid-upload and the failure is
 * reported three different ways, none of which names the cause:
 *
 *   app    [site-config/restore] Error: aborted { code: 'ECONNRESET' }
 *   nginx  upstream prematurely closed connection while reading upstream
 *   admin  "Restore failed: the connection dropped during upload"
 *
 * The tell is that every attempt dies after roughly the same number of bytes
 * for a given link speed, not at the same offset in the archive — the limit is
 * a clock, not a size.
 *
 * A preload is used because the server instance is unreachable from
 * application code. The standalone `server.js` hands off to `startServer()`,
 * which constructs the server itself and assigns only `keepAliveTimeout`;
 * `instrumentation.ts` would run too late, after the server is already
 * listening. Wrapping `http.createServer` is the last hook that runs first.
 *
 * Disabling the limit outright is safe here because it is not what protects
 * this process. The app is published on loopback only (see
 * docker-compose.prod.yaml), so every request arrives through nginx, which
 * enforces `client_body_timeout` per location — 600 s generally, 24 h on the
 * restore route (deploy/nginx-jct.conf.example). `headersTimeout` is left at
 * its 60 s default on purpose, so a client that dribbles request *headers* is
 * still cut off; only the body is unbounded.
 */

const http = require("node:http");

const createServer = http.createServer;

http.createServer = function patchedCreateServer(...args) {
  const server = createServer.apply(this, args);
  // 0 disables the limit. Assigned after construction rather than passed as an
  // option because the caller owns the options object.
  server.requestTimeout = 0;
  return server;
};
