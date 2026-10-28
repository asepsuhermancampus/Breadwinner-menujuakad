import { afterEach, beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { assertOrigin } from "./http";
afterEach(() => vi.unstubAllEnvs());
beforeEach(() => {
  vi.stubEnv("AUTH_URL", undefined);
  vi.stubEnv("NEXTAUTH_URL", undefined);
  vi.stubEnv("REVIEWS_APP_ORIGIN", undefined);
});
const request = (target: string, origin?: string, host?: string) =>
  new Request(`${target}/api/auth/register`, {
    method: "POST",
    headers: {
      ...(origin ? { origin } : {}),
      ...(host ? { host } : {}),
      "x-forwarded-host": "hostile.invalid",
    },
  });
it.each([
  ["http://0.0.0.0:3200", "http://localhost:3200"],
  ["http://0.0.0.0:3200", "http://127.0.0.1:3200"],
  ["http://localhost:3200", "http://127.0.0.1:3200"],
  ["http://[::]:3200", "http://[::1]:3200"],
])(
  "accepts local registration %s from %s despite a wildcard development bind",
  (target, origin) => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REVIEWS_APP_ORIGIN", undefined);
    expect(() => assertOrigin(request(target, origin, new URL(origin).host))).not.toThrow();
  },
);
it.each([
  ["http://localhost:3201", "localhost:3201"],
  ["https://localhost:3200", "localhost:3200"],
  ["http://localhost:3200", "127.0.0.1:3200"],
  ["https://hostile.invalid", "hostile.invalid"],
  ["null", "localhost:3200"],
  [undefined, "localhost:3200"],
])("rejects unrelated registration origin %s / host %s", (origin, host) => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("REVIEWS_APP_ORIGIN", undefined);
  expect(() => assertOrigin(request("http://0.0.0.0:3200", origin, host))).toThrow();
});
it("keeps production strict and honors an explicitly configured application origin", () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("REVIEWS_APP_ORIGIN", undefined);
  expect(() =>
    assertOrigin(request("http://0.0.0.0:3200", "http://localhost:3200", "localhost:3200")),
  ).toThrow();
  vi.stubEnv("REVIEWS_APP_ORIGIN", "https://app.example.test");
  expect(() =>
    assertOrigin(request("http://internal:3200", "https://app.example.test", "internal:3200")),
  ).not.toThrow();
  expect(() =>
    assertOrigin(request("http://internal:3200", "https://hostile.invalid", "internal:3200")),
  ).toThrow();
});
it.each(["AUTH_URL", "NEXTAUTH_URL"] as const)(
  "accepts a configured deployed domain through %s behind an internal server",
  (key) => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv(key, "https://wedding.example.test");
    expect(() =>
      assertOrigin(
        request("http://internal:3200", "https://wedding.example.test", "internal:3200"),
      ),
    ).not.toThrow();
    expect(() =>
      assertOrigin(
        request(
          "http://internal:3200",
          "https://wedding.example.test.evil.invalid",
          "internal:3200",
        ),
      ),
    ).toThrow();
    expect(() =>
      assertOrigin(request("http://internal:3200", "http://wedding.example.test", "internal:3200")),
    ).toThrow();
  },
);
