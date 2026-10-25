import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next-auth", () => ({ default: () => ({ handlers: {} }) }));
import { isGoogleAuthReady } from "./auth";
afterEach(() => vi.unstubAllEnvs());
it("rejects each absent or whitespace Google configuration value", () => {
  for (const key of ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "AUTH_SECRET"] as const) {
    for (const missing of ["", "  \t\n"]) {
      vi.stubEnv("AUTH_GOOGLE_ID", "id");
      vi.stubEnv("AUTH_GOOGLE_SECRET", "secret");
      vi.stubEnv("AUTH_SECRET", "session-secret");
      vi.stubEnv(key, missing);
      expect(isGoogleAuthReady()).toBe(false);
    }
  }
});
