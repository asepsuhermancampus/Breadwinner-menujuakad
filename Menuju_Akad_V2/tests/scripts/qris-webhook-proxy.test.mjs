import http from "node:http";
import { once } from "node:events";
import { afterEach, test } from "node:test";
import assert from "node:assert/strict";
import { createProxyServer, TARGET_PATH } from "../../scripts/qris-webhook-proxy.mjs";

const servers = [];
async function listen(server) {
  servers.push(server);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server.address().port;
}
async function fixture(handler) {
  const upstreamPort = await listen(http.createServer(handler));
  const port = await listen(createProxyServer({ upstreamPort }));
  return `http://127.0.0.1:${port}`;
}
afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise((resolve) => {
          server.closeAllConnections();
          server.close(resolve);
        }),
    ),
  );
});

test("exposes only the webhook path and keeps every response private", async () => {
  const base = await fixture((_req, res) => res.end("{}"));
  for (const path of ["/", "/api/auth/session", TARGET_PATH]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
});

test("forwards callbacks without cookies or authorization and acknowledges valid JSON", async () => {
  let headers;
  const base = await fixture((req, res) => {
    headers = req.headers;
    req.resume();
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ received: true }));
  });
  const response = await fetch(base + TARGET_PATH, {
    method: "POST",
    body: "{}",
    headers: { Cookie: "authjs.session-token=private", Authorization: "Bearer private" },
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: true });
  assert.equal(headers.cookie, undefined);
  assert.equal(headers.authorization, undefined);
});

test("oversized incoming payload receives 413 without an aborted response", async () => {
  let called = false;
  const base = await fixture((_req, res) => {
    called = true;
    res.end("{}");
  });
  const response = await fetch(base + TARGET_PATH, { method: "POST", body: "x".repeat(33 * 1024) });
  assert.equal(response.status, 413);
  await response.json();
  assert.equal(called, false);
});

test("rejects upstream HTML and oversized responses without reflecting their contents", async () => {
  for (const oversized of [false, true]) {
    const base = await fixture((_req, res) => {
      res.setHeader("content-type", oversized ? "application/json" : "text/html");
      res.end(
        oversized
          ? JSON.stringify({ secret: "x".repeat(33 * 1024) })
          : "<html>private stack trace</html>",
      );
    });
    const response = await fetch(base + TARGET_PATH, { method: "POST", body: "{}" });
    assert.equal(response.status, 502);
    const text = await response.text();
    assert(!text.includes("private stack"));
    assert(text.length < 1024);
  }
});
