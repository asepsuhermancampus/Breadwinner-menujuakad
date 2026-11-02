import { describe, expect, it } from "vitest";
import { extractOverviewFinance } from "./overview-finance";
import type { CustomerWorkspace } from "../types";

const mockWorkspace: CustomerWorkspace = {
  id: "ws-1",
  role: "owner",
  revision: 1,
  subscription: {
    planId: "free",
    expiresAt: null,
    capabilities: [],
    latestGrantId: null,
  },
  profile: {
    fullName: "Rian",
    partnerName: "Aulia",
    nickname: "Rian",
    partnerNickname: "Aulia",
  },
  ownerSide: "groom",
  partnerAccess: { state: "locked" },
};

describe("extractOverviewFinance", () => {
  it("detects single user without connected partner", () => {
    const result = extractOverviewFinance(
      mockWorkspace,
      false,
      undefined,
      {
        revision: 1,
        budgets: [],
        members: [{ actorId: "u1", actorName: "Rian", side: "groom" }],
        entries: [],
        allocations: [],
        balances: { groom: 50000000, bride: 0, total: 50000000 },
        actorSide: "groom",
      },
    );

    expect(result.hasPartner).toBe(false);
    expect(result.balances.total).toBe(50000000);
    expect(result.partnerNames.user).toBe("Rian");
  });

  it("detects two partners when partner access is connected", () => {
    const connectedWorkspace: CustomerWorkspace = {
      ...mockWorkspace,
      partnerAccess: { state: "connected" },
    };

    const result = extractOverviewFinance(
      connectedWorkspace,
      false,
      undefined,
      {
        revision: 1,
        budgets: [],
        members: [
          { actorId: "u1", actorName: "Rian", side: "groom" },
          { actorId: "u2", actorName: "Aulia", side: "bride" },
        ],
        entries: [],
        allocations: [],
        balances: { groom: 50000000, bride: 40000000, total: 90000000 },
        actorSide: "groom",
      },
    );

    expect(result.hasPartner).toBe(true);
    expect(result.balances.total).toBe(90000000);
    expect(result.balances.groom).toBe(50000000);
    expect(result.balances.bride).toBe(40000000);
  });
});
