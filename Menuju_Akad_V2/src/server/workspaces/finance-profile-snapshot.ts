import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { workspaceOwnerSide } from "./couple-side";
import { profileNames } from "@/features/customer-workspace/domain/profile-names";
import type { FinanceSnapshot, SavingsSide } from "@/features/planner-finance/types/finance-ledger";

export function withFinanceProfileNames(
  db: DatabaseSync,
  workspaceId: string,
  snapshot: FinanceSnapshot,
): FinanceSnapshot {
  const row = db
    .prepare(
      "SELECT owner,full_name,partner_name,nickname,partner_nickname FROM customer_workspaces WHERE id=?",
    )
    .get(workspaceId)!;
  const owner = String(row["owner"]);
  const names = profileNames({
    fullName: String(row["full_name"]),
    partnerName: row["partner_name"] as string | null,
    nickname: String(row["nickname"]),
    partnerNickname: row["partner_nickname"] as string | null,
  });
  const active = new Set(
    db
      .prepare("SELECT account FROM workspace_members WHERE workspace_id=?")
      .all(workspaceId)
      .map((member) => String(member["account"])),
  );
  const claimedOwner = snapshot.members.find((member) => member.actorId === owner);
  const claimedPartner = snapshot.members.find(
    (member) => member.actorId !== owner && active.has(member.actorId),
  );
  const ownerSide: SavingsSide | undefined =
    workspaceOwnerSide(db, workspaceId, owner) ??
    claimedOwner?.side ??
    (claimedPartner ? (claimedPartner.side === "groom" ? "bride" : "groom") : undefined);
  const sideNames = { groom: "Pasangan pria", bride: "Pasangan wanita" };
  if (ownerSide) {
    const partnerSide = ownerSide === "groom" ? "bride" : "groom";
    if (names.own) sideNames[ownerSide] = names.own;
    if (names.partner && active.size > 1) sideNames[partnerSide] = names.partner;
  }
  const actorName = (actorId: string, previous: string) => {
    if (!active.has(actorId)) return previous;
    return (actorId === owner ? names.own : names.partner) || previous;
  };
  return {
    ...snapshot,
    sideNames,
    members: snapshot.members.map((member) => ({
      ...member,
      actorName: actorName(member.actorId, member.actorName),
    })),
    entries: snapshot.entries.map((entry) => ({
      ...entry,
      actorName: actorName(entry.actorId, entry.actorName),
    })),
  };
}
