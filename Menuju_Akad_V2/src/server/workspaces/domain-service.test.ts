import { expect, it, vi } from "vitest";
import { validateDomain } from "./domain-service";
vi.mock("server-only", () => ({}));
it("rejects local, IP and invalid domains", () => {
  for (const host of [
    "localhost",
    "127.0.0.1",
    "10.0.0.1",
    "localhost.localdomain",
    "evil.test",
    "example.com/path",
    "https://example.com",
    "a..com",
  ])
    expect(() => validateDomain(host)).toThrow();
  expect(validateDomain("Wedding.Example.com")).toBe("wedding.example.com");
});
