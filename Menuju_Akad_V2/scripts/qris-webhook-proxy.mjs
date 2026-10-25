#!/usr/bin/env node
// Expose only this callback through the local HTTPS tunnel, never the application or auth routes.
import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const PROXY_PORT = 3210;
export const PROXY_HOST = "127.0.0.1";
export const UPSTREAM_PORT = 3201;
export const UPSTREAM_HOST = "127.0.0.1";
export const TARGET_PATH = "/api/payments/klikqris/webhook";
export const MAX_BODY_BYTES = 32 * 1024;
export const UPSTREAM_TIMEOUT_MS = 12_000;

export function createProxyServer({ upstreamPort = UPSTREAM_PORT } = {}) {
  return http.createServer(
    { requestTimeout: 10_000, headersTimeout: 5000, connectionsCheckingInterval: 1000 },
    (req, res) => {
      const send = (status, payload) => {
        if (res.writableEnded || res.destroyed) return;
        res.writeHead(status, {
          "Content-Type": "application/json",
          "Cache-Control": "private, no-store",
        });
        res.end(JSON.stringify(payload));
      };
      if (req.method !== "POST" || req.url !== TARGET_PATH) {
        req.resume();
        send(404, { error: "Not Found" });
        return;
      }
      const chunks = [];
      let bytes = 0;
      let rejected = false;
      req.on("error", () => send(400, { error: "Permintaan tidak valid." }));
      req.on("data", (chunk) => {
        if (rejected) return;
        bytes += chunk.length;
        if (bytes > MAX_BODY_BYTES) {
          rejected = true;
          chunks.length = 0;
          res.setHeader("Connection", "close");
          send(413, { error: "Payload melebihi 32KB." });
          return;
        }
        chunks.push(chunk);
      });
      req.on("end", () => {
        if (rejected || res.destroyed) return;
        const upstreamReq = http.request(
          {
            hostname: UPSTREAM_HOST,
            port: upstreamPort,
            path: TARGET_PATH,
            method: "POST",
            headers: { "Content-Type": "application/json", "Content-Length": String(bytes) },
          },
          (upstreamRes) => {
            const contentType = String(upstreamRes.headers["content-type"] ?? "");
            if (!contentType.toLowerCase().startsWith("application/json")) {
              upstreamRes.resume();
              send(502, { error: "Balasan layanan webhook tidak valid." });
              return;
            }
            const responseChunks = [];
            let responseBytes = 0;
            upstreamRes.on("data", (chunk) => {
              responseBytes += chunk.length;
              if (responseBytes > MAX_BODY_BYTES) {
                send(502, { error: "Balasan layanan webhook terlalu besar." });
                upstreamRes.destroy();
              } else responseChunks.push(chunk);
            });
            upstreamRes.on("error", () =>
              send(502, { error: "Layanan webhook tidak dapat dihubungi." }),
            );
            upstreamRes.on("end", () => {
              if (responseBytes > MAX_BODY_BYTES) return;
              try {
                const body = JSON.parse(Buffer.concat(responseChunks).toString("utf8"));
                const status = upstreamRes.statusCode ?? 502;
                if (status === 200 && body?.received === true) send(200, { received: true });
                else if (status >= 400) send(status, { error: "Permintaan webhook ditolak." });
                else send(502, { error: "Balasan layanan webhook tidak valid." });
              } catch {
                send(502, { error: "Balasan layanan webhook tidak valid." });
              }
            });
          },
        );
        const deadline = setTimeout(() => {
          send(504, { error: "Layanan webhook melewati batas waktu." });
          upstreamReq.destroy();
        }, UPSTREAM_TIMEOUT_MS);
        upstreamReq.on("close", () => clearTimeout(deadline));
        upstreamReq.on("error", () =>
          send(502, { error: "Layanan webhook tidak dapat dihubungi." }),
        );
        res.on("close", () => {
          if (!res.writableFinished) upstreamReq.destroy();
        });
        upstreamReq.end(Buffer.concat(chunks));
      });
    },
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  createProxyServer().listen(PROXY_PORT, PROXY_HOST, () => {
    process.stdout.write(`QRIS callback proxy: http://${PROXY_HOST}:${PROXY_PORT}${TARGET_PATH}\n`);
  });
}
