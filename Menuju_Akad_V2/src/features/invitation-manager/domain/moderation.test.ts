import { describe, expect, it } from "vitest";
import { decideModeration } from "./moderation";
import { moderationItems } from "../content/moderation-content";

describe("moderation decisions", () => {
  it("blocks public display when consent was withheld", () => {
    expect(decideModeration(moderationItems[3]!, 1, "Ditampilkan", "Layak tampil").ok).toBe(false);
  });

  it("requires a reason and a current version", () => {
    expect(decideModeration(moderationItems[0]!, 1, "Disembunyikan", "").ok).toBe(false);
    expect(decideModeration(moderationItems[0]!, 0, "Disembunyikan", "Privasi").ok).toBe(false);
  });

  it("keeps a versioned reason when a human hides a submission", () => {
    const result = decideModeration(moderationItems[0]!, 1, "Disembunyikan", "Privasi wajah");
    expect(result).toMatchObject({
      ok: true,
      item: {
        status: "Disembunyikan",
        version: 2,
        audit: [{ reason: "Privasi wajah", version: 2 }],
      },
    });
  });

  it("rejects a second decision from an already reviewed snapshot", () => {
    const result = decideModeration(
      moderationItems[0]!,
      1,
      "Ditampilkan",
      "Izin dan konten ditinjau",
    );
    if (!result.ok) throw new Error(result.error);
    expect(decideModeration(result.item, 1, "Ditampilkan", "Klik ulang").ok).toBe(false);
  });
});
