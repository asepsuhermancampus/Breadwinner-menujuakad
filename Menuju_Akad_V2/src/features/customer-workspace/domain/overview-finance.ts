import type { CustomerWorkspace } from "../types";
import type { FinanceBook, FinanceSnapshot } from "@/features/planner-finance/types/finance-ledger";

export type OverviewFinanceInfo = {
  balances: { groom: number; bride: number; total: number };
  hasPartner: boolean;
  partnerNames: { user: string; partner: string };
  ownerSide: "groom" | "bride";
};

export function extractOverviewFinance(
  workspace: CustomerWorkspace,
  guest: boolean,
  trialBook?: FinanceBook | undefined,
  accountSnapshot?: FinanceSnapshot | null | undefined,
): OverviewFinanceInfo {
  const trialEntries = trialBook?.entries ?? [];
  let trialGroom = 0;
  let trialBride = 0;
  for (const e of trialEntries) {
    if (e.side === "groom") trialGroom += e.amount;
    if (e.side === "bride") trialBride += e.amount;
  }

  const balances = guest
    ? { groom: trialGroom, bride: trialBride, total: trialGroom + trialBride }
    : (accountSnapshot?.balances ?? { groom: 0, bride: 0, total: 0 });

  const members = guest ? (trialBook?.members ?? []) : (accountSnapshot?.members ?? []);
  const hasPartner =
    workspace.partnerAccess?.state === "connected" ||
    members.length > 1 ||
    (balances.groom > 0 && balances.bride > 0);

  const ownerSide = workspace.ownerSide ?? "groom";
  const partnerNames = {
    user: workspace.profile.nickname?.trim() || workspace.profile.fullName?.trim() || "Saya",
    partner:
      workspace.profile.partnerNickname?.trim() ||
      workspace.profile.partnerName?.trim() ||
      "Pasangan",
  };

  return { balances, hasPartner, partnerNames, ownerSide };
}

