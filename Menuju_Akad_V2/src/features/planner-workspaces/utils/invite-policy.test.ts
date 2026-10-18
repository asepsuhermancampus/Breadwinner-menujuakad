import { describe, expect, it } from "vitest";
import type { PartnerInvite, WorkspaceMembership } from "../contracts";
import { assertCanRedeem, inviteState, localInvitePath } from "./invite-policy";

const invite: PartnerInvite = {
  token: "opaque-demo-3dbab2e792ed460697001460",
  workspaceId: "couple-a",
  ownerId: "owner-a",
  expiresAt: 2_000,
  status: "pending",
  redeemedBy: null,
};
const owner: WorkspaceMembership = {
  workspaceId: "couple-a",
  actorId: "owner-a",
  role: "owner",
};

describe("partner invite capability", () => {
  it("expires at the adapter clock boundary", () => {
    expect(inviteState(invite, 1_999)).toBe("pending");
    expect(inviteState(invite, 2_000)).toBe("expired");
  });

  it.each(["revoked", "used"] as const)("rejects %s capabilities", (status) => {
    expect(() => assertCanRedeem({ ...invite, status }, "partner-a", [owner], 1_000)).toThrow(
      status === "used" ? "sudah dipakai" : "dicabut",
    );
  });

  it("rejects expired tokens, owner self-redemption and a mismatched workspace owner", () => {
    expect(() => assertCanRedeem(invite, "partner-a", [owner], 2_000)).toThrow("kedaluwarsa");
    expect(() => assertCanRedeem(invite, "owner-a", [owner], 1_000)).toThrow("pemilik");
    expect(() => assertCanRedeem(invite, "partner-a", [], 1_000)).toThrow("pemilik");
  });

  it("does not add duplicate membership or merge workspaces", () => {
    const partner = { ...owner, actorId: "partner-a", role: "partner" as const };
    expect(() => assertCanRedeem(invite, "partner-a", [owner, partner], 1_000)).toThrow(
      "sudah menjadi anggota",
    );
    expect(() =>
      assertCanRedeem(
        invite,
        "partner-a",
        [
          owner,
          {
            ...partner,
            workspaceId: "other-workspace",
          },
        ],
        1_000,
      ),
    ).toThrow("ruang kerja lain");
  });

  it("accepts a new actor and generates only a local preview path", () => {
    expect(() => assertCanRedeem(invite, "partner-a", [owner], 1_000)).not.toThrow();
    expect(localInvitePath(invite.token)).toBe(`/join/${invite.token}`);
  });

  it("does not add a third account to an existing couple workspace", () => {
    expect(() =>
      assertCanRedeem(
        invite,
        "third",
        [
          owner,
          {
            ...owner,
            actorId: "partner-a",
            role: "partner",
          },
        ],
        1_000,
      ),
    ).toThrow("dua akun");
  });
});
