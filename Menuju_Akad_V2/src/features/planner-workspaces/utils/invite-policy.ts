import { WorkspaceFault, type PartnerInvite, type WorkspaceMembership } from "../contracts";

export function inviteState(invite: PartnerInvite, now: number) {
  if (invite.status !== "pending") return invite.status;
  return now >= invite.expiresAt ? "expired" : "pending";
}

export function localInvitePath(token: string) {
  return `/join/${encodeURIComponent(token)}`;
}

export function assertCanRedeem(
  invite: PartnerInvite,
  actorId: string,
  memberships: readonly WorkspaceMembership[],
  now: number,
) {
  const state = inviteState(invite, now);
  if (state === "expired") throw new WorkspaceFault("expired", "Tautan sudah kedaluwarsa.");
  if (state === "revoked") throw new WorkspaceFault("revoked", "Tautan sudah dicabut.");
  if (state === "used") throw new WorkspaceFault("used", "Tautan sudah dipakai.");
  if (
    actorId === invite.ownerId ||
    !memberships.some(
      (member) =>
        member.workspaceId === invite.workspaceId &&
        member.actorId === invite.ownerId &&
        member.role === "owner",
    )
  ) {
    throw new WorkspaceFault("wrong-owner", "Identitas pemilik undangan tidak sesuai.");
  }
  if (
    memberships.some(
      (member) => member.workspaceId === invite.workspaceId && member.actorId === actorId,
    )
  ) {
    throw new WorkspaceFault("duplicate-member", "Akun sudah menjadi anggota ruang ini.");
  }
  if (memberships.some((member) => member.actorId === actorId)) {
    throw new WorkspaceFault(
      "forbidden",
      "Akun memiliki ruang kerja lain. Tidak digabung otomatis.",
    );
  }
  if (
    memberships.some(
      (member) => member.workspaceId === invite.workspaceId && member.role === "partner",
    )
  ) {
    throw new WorkspaceFault("forbidden", "Ruang pasangan sudah terhubung dengan dua akun.");
  }
}
