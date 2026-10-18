import { describe, expect, it } from "vitest";
import { validateMomentUpload } from "./moment-upload";

describe("private moment uploads", () => {
  it("requires consent even for valid files", () => {
    expect(validateMomentUpload({ type: "image/jpeg", size: 2800000 }, false)).toMatchObject({
      ok: false,
    });
  });
  it("rejects unsupported files and files above 10 MiB", () => {
    expect(validateMomentUpload({ type: "image/svg+xml", size: 1000 }, true).ok).toBe(false);
    expect(validateMomentUpload({ type: "image/png", size: 10485761 }, true).ok).toBe(false);
    expect(validateMomentUpload({ type: "image/png", size: 10485760 }, true).ok).toBe(true);
  });
});
