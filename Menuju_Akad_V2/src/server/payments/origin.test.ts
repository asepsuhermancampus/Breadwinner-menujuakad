import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: vi.fn() }));
import { validateSameOrigin } from "./http";
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
