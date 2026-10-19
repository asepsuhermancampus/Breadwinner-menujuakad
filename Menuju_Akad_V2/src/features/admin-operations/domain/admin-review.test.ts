import { describe, expect, it } from "vitest";
import { createAdminReviewState } from "../content/admin-content";
import { reviewAdminItem, calendarExport } from "./admin-review";
import type { ReviewContext, ReviewDecision } from "../types/admin";
import { masterCalendar } from "../content/admin-content";
const context: ReviewContext = {
  role: "superadmin",
  actor: "Nadia Permata",
  online: true,
  sessionValid: true,
  canReview: true,
  now: () => "2026-10-25T10:42:00+07:00",
};
const decision: ReviewDecision = {
  kind: "moderation",
  id: "M-403",
  expectedVersion: 2,
  action: "false-positive",
  reason: "Ukuran cetak 20 × 30 cm bukan nomor kontak.",
  acknowledged: true,
  operationId: "review-luma",
};
describe("admin human review", () => {
  it("requires a human reason and preserves KYB when clearing scanner false positives", () => {
    const state = createAdminReviewState();
    expect(reviewAdminItem(state, { ...decision, reason: "" }, context).ok).toBe(false);
    const result = reviewAdminItem(state, decision, context);
    expect(result.ok).toBe(true);
    expect(result.state.kyb).toEqual(state.kyb);
    expect(result.state.moderation[2]!.status).toBe("false-positive");
    expect(result.state.audit[0]).toMatchObject({
      version: 2,
      actor: "Nadia Permata",
      at: "2026-10-25T10:42:00+07:00",
    });
  });
  it("denies support, revoked permission, offline, stale version and missing acknowledgement", () => {
    for (const patch of [
      { role: "support" as const },
      { canReview: false },
      { sessionValid: false },
      { online: false },
    ])
      expect(reviewAdminItem(createAdminReviewState(), decision, { ...context, ...patch }).ok).toBe(
        false,
      );
    for (const patch of [{ expectedVersion: 1 }, { acknowledged: false }])
      expect(reviewAdminItem(createAdminReviewState(), { ...decision, ...patch }, context).ok).toBe(
        false,
      );
  });
  it("never approves a truncated bank proof and never repeats an audited decision", () => {
    const kyb = {
      ...decision,
      kind: "kyb" as const,
      id: "KYB-341",
      expectedVersion: 3,
      action: "approved" as const,
    };
    expect(reviewAdminItem(createAdminReviewState(), kyb, context).ok).toBe(false);
    const first = reviewAdminItem(createAdminReviewState(), decision, context);
    const replay = reviewAdminItem(first.state, decision, context);
    expect(replay.ok).toBe(true);
    expect(replay.state.audit).toHaveLength(1);
  });
  it("restricts calendar export to public scheduling fields and blocks support export", () => {
    const csv = calendarExport(masterCalendar, "superadmin");
    expect(csv).toContain("ORD-8248");
    expect(csv).not.toContain("Rama & Sinta");
    expect(calendarExport(masterCalendar, "support")).toBeNull();
  });
});
