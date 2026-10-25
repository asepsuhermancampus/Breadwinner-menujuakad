import type { CustomerWorkspace } from "../types";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";
export type DashboardAccess =
  | { mode: "guest"; workspace: CustomerWorkspace; identity?: never }
  | { mode: "account"; workspace: CustomerWorkspace; identity: string };
export function guestDashboardAccess(): DashboardAccess {
  return {
    mode: "guest",
    workspace: {
      id: "guest-trial",
      role: "owner",
      revision: 0,
      profile: { fullName: "", partnerName: null },
      subscription: {
        planId: "free",
        expiresAt: null,
        latestGrantId: null,
        capabilities: capabilitiesFor("free"),
      },
    },
  };
}
