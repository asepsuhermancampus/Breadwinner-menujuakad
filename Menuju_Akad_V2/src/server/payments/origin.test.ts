import { afterEach, beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: vi.fn() }));
import { validateSameOrigin } from "./http";
afterEach(() => vi.unstubAllEnvs());
beforeEach(() => {
  vi.stubEnv("AUTH_URL", undefined);
  vi.stubEnv("NEXTAUTH_URL", undefined);
  vi.stubEnv("REVIEWS_APP_ORIGIN", undefined);
});

it.each([
  ["http://0.0.0.0:3200", "http://localhost:3200"],
  ["http://0.0.0.0:3200", "http://127.0.0.1:3200"],
  ["http://[::]:3200", "http://[::1]:3200"],
])(
  "accepts the browser's local origin %s -> %s when Next binds all interfaces",
  (target, source) => {
    vi.stubEnv("NODE_ENV", "development");
    expect(
      validateSameOrigin(
        new Request(`${target}/api/workspace/resources/finance`, {
          method: "PUT",
          headers: { origin: source, host: new URL(source).host },
        }),
      ),
    ).toBeNull();
  },
);

it.each([
  { origin: "http://localhost:3201", host: "localhost:3201" },
  { origin: "https://localhost:3200", host: "localhost:3200" },
  { origin: "http://localhost:3200", host: "127.0.0.1:3200" },
  { origin: "http://hostile.invalid:3200", host: "hostile.invalid:3200" },
  {
    origin: "http://hostile.invalid:3200",
    host: "localhost:3200",
    "x-forwarded-host": "hostile.invalid:3200",
  },
  { origin: "null", host: "localhost:3200" },
  { host: "localhost:3200" },
])("rejects mismatched or untrusted origins for a wildcard development bind: %j", (headers) => {
  vi.stubEnv("NODE_ENV", "development");
  const requestHeaders = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (value !== undefined) requestHeaders.set(name, value);
  }
  expect(
    validateSameOrigin(
      new Request("http://0.0.0.0:3200/api/workspace/resources/finance", {
        method: "PUT",
        headers: requestHeaders,
      }),
    )?.status,
  ).toBe(403);
});

it("keeps production origin matching strict even for local wildcard binds", () => {
  vi.stubEnv("NODE_ENV", "production");
  expect(
    validateSameOrigin(
      new Request("http://0.0.0.0:3200/api/workspace/resources/finance", {
        headers: { origin: "http://localhost:3200", host: "localhost:3200" },
      }),
    )?.status,
  ).toBe(403);
  expect(
    validateSameOrigin(
      new Request("https://app.example/api/workspace/resources/finance", {
        headers: { origin: "https://app.example", host: "app.example" },
      }),
    ),
  ).toBeNull();
});
it("accepts a matching loopback host in local development despite Next canonical localhost", () => {
  vi.stubEnv("NODE_ENV", "development");
  expect(
    validateSameOrigin(
      new Request("http://localhost:3201/api/payments/plans", {
        headers: { origin: "http://127.0.0.1:3201", host: "127.0.0.1:3201" },
      }),
    ),
  ).toBeNull();
  vi.unstubAllEnvs();
});
it("does not trust arbitrary forwarded host or external origin", () => {
  vi.stubEnv("NODE_ENV", "development");
  expect(
    validateSameOrigin(
      new Request("http://localhost:3201/x", {
        headers: {
          origin: "https://evil.invalid",
          host: "localhost:3201",
          "x-forwarded-host": "evil.invalid",
        },
      }),
    )?.status,
  ).toBe(403);
  vi.unstubAllEnvs();
});
it("accepts only the configured public application origin behind a production proxy", () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("AUTH_URL", "https://wedding.example.test");
  expect(
    validateSameOrigin(
      new Request("http://internal:3200/api/auth/callback/credentials", {
        headers: { origin: "https://wedding.example.test", host: "internal:3200" },
      }),
    ),
  ).toBeNull();
  expect(
    validateSameOrigin(
      new Request("http://internal:3200/api/auth/callback/credentials", {
        headers: {
          origin: "https://evil.invalid",
          host: "internal:3200",
          "x-forwarded-host": "wedding.example.test",
        },
      }),
    )?.status,
  ).toBe(403);
});
it("does not authorize a separate reviews origin for account or payment mutations", () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("REVIEWS_APP_ORIGIN", "https://reviews.example.test");
  expect(
    validateSameOrigin(
      new Request("http://internal:3200/api/auth/callback/credentials", {
        headers: { origin: "https://reviews.example.test", host: "internal:3200" },
      }),
    )?.status,
  ).toBe(403);
});
