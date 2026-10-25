import { afterEach, expect, it, vi } from "vitest";
import { openReviewDatabase } from "./database";
import { provisionAccount, verifyCredentials } from "./accounts";
import { createSession, findSession, revokeSession, SESSION_SECONDS } from "./sessions";
import { consumeLimit } from "./rate-limit";
import { assertOrigin, readJson } from "./http";
import { createVisitorToken, requestIdentity, VISITOR_COOKIE } from "./visitor";
vi.mock("server-only", () => ({}));
const dbs: ReturnType<typeof openReviewDatabase>[] = [];
function setup() {
  const db = openReviewDatabase(":memory:");
  dbs.push(db);
  return db;
}
afterEach(() => dbs.splice(0).forEach((db) => db.close()));
const email = "superadmin@example.test",
  password = "ReviewTest!2026";

it("stores hashed credentials and provisioning never resets existing passwords", () => {
  const db = setup();
  provisionAccount(db, email, password);
  const row = db.prepare("SELECT * FROM review_admins").get()!;
  expect(JSON.stringify(row)).not.toContain(password);
  expect(verifyCredentials(db, email.toUpperCase(), password)?.email).toBe(email);
  expect(verifyCredentials(db, email, "wrong-password")).toBeNull();
  expect(verifyCredentials(db, "other@example.test", password)).toBeNull();
  provisionAccount(db, email, "DifferentPassword!123");
  expect(verifyCredentials(db, email, password)).not.toBeNull();
});
it("rejects forged/expired sessions and logout revokes server-side", () => {
  const db = setup();
  const account = provisionAccount(db, email, password);
  const token = createSession(db, account.id, 1000);
  expect(JSON.stringify(db.prepare("SELECT * FROM review_sessions").get())).not.toContain(token);
  expect(findSession(db, token, 1001)?.role).toBe("superadmin");
  expect(findSession(db, "forged", 1001)).toBeNull();
  expect(findSession(db, token, 1000 + SESSION_SECONDS * 1000)).toBeNull();
  revokeSession(db, token);
  expect(findSession(db, token, 1001)).toBeNull();
});
it("persists bounded throttle windows and accepts the next window", () => {
  const db = setup();
  expect(consumeLimit(db, "login:test", 2, 1000, 10)).toBe(true);
  expect(consumeLimit(db, "login:test", 2, 1000, 11)).toBe(true);
  expect(consumeLimit(db, "login:test", 2, 1000, 12)).toBe(false);
  expect(consumeLimit(db, "login:test", 2, 1000, 1010)).toBe(true);
});
it("rejects hostile and absent origins instead of trusting forwarded hosts", () => {
  const request = (origin?: string) =>
    new Request("http://localhost:3200/api/reviews", {
      method: "POST",
      headers: { ...(origin ? { origin } : {}), "x-forwarded-host": "evil.test" },
    });
  expect(() => assertOrigin(request("http://localhost:3200"))).not.toThrow();
  expect(() => assertOrigin(request("https://evil.test"))).toThrow();
  expect(() => assertOrigin(request())).toThrow();
});
it("caps actual streamed JSON bodies regardless of content-length", async () => {
  const request = new Request("http://localhost/api/reviews", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "x".repeat(17000) }),
  });
  await expect(readJson(request)).rejects.toThrow();
});

it("isolates visitor limits with server-issued identities and rejects forged cookies", () => {
  const db = setup();
  const identity = (token: string) =>
    requestIdentity(
      new Request("http://localhost", {
        headers: { cookie: `${VISITOR_COOKIE}=${token}` },
      }),
      db,
    );
  const first = identity(createVisitorToken(db));
  const second = identity(createVisitorToken(db));
  expect(first).not.toBe(second);
  expect(() => identity("forged")).toThrow();
  expect(consumeLimit(db, first, 1, 1000)).toBe(true);
  expect(consumeLimit(db, first, 1, 1000)).toBe(false);
  expect(consumeLimit(db, second, 1, 1000)).toBe(true);
});
