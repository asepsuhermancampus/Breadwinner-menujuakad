import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
it("real auth and onboarding entrypoints never mount mock adapters", () => {
  for (const path of [
    "src/app/login/page.tsx",
    "src/app/auth/[mode]/page.tsx",
    "src/app/onboarding/[step]/page.tsx",
    "src/app/join/[token]/page.tsx",
  ]) {
    const code = readFileSync(path, "utf8");
    expect(code).not.toMatch(/@\/preview|PreviewAuth|PreviewOnboarding|PreviewJoin/);
  }
});
