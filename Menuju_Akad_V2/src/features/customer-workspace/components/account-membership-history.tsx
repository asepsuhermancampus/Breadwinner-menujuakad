export type MembershipAudit = {
  workspace_id: string;
  actor: string;
  action: string;
  targetEmail: string;
  reason: string;
  created_at: string;
};
export function AccountMembershipHistory({ history }: { history: MembershipAudit[] }) {
  return (
    <>
      <h3 className="font-semibold">Riwayat tindakan keanggotaan</h3>
      {history.length ? (
        <ul>
          {history.map((entry, i) => (
            <li key={`${entry.created_at}-${i}`} className="border-t border-ux-border py-2 text-sm">
              {entry.workspace_id} -{" "}
              {entry.action === "cancel_invite" ? "Undangan dibatalkan" : "Akses pasangan dicabut"}{" "}
              - {entry.targetEmail} - {entry.reason}
              <br />
              {entry.actor} - {entry.created_at}
            </li>
          ))}
        </ul>
      ) : (
        <p>Belum ada tindakan keanggotaan oleh superadmin.</p>
      )}
    </>
  );
}
