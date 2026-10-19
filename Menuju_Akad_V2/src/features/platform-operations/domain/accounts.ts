import type { AccountEntry, GateContext } from "../types/operations";
import { accepted, blocked, guardOperation } from "./guards";
export function reviewAccounts(input: {
  accounts: AccountEntry[];
  selected: string[];
  expectedVersions: Record<string, number>;
  context: GateContext;
  reason: string;
  acknowledged: boolean;
  adminCount: number;
  mode: "restrict" | "sessions";
}) {
  const { accounts, selected, expectedVersions, context, reason, acknowledged, adminCount, mode } =
    input;
  if (!selected.length) return { ...blocked("Pilih setidaknya satu akun."), accounts };
  if (!acknowledged || reason.trim().length < 8)
    return { ...blocked("Tinjau dampak sesi, isi alasan dan konfirmasi."), accounts };
  const targets = selected.map((id) => accounts.find((account) => account.id === id));
  let removedAdmins = 0;
  for (const account of targets) {
    if (!account) return { ...blocked("Akun pilihan tidak lagi tersedia. Muat ulang."), accounts };
    const gate = guardOperation({
      ...context,
      action: "accounts.write",
      expectedVersion: expectedVersions[account.id] ?? -1,
      version: account.version,
    });
    if (!gate.ok) return { ...gate, accounts };
    if (mode === "restrict" && account.id === context.actorId)
      return { ...blocked("Tidak boleh mengubah izin sendiri."), accounts };
    if (mode === "restrict" && account.admin && account.status !== "Dibatasi") removedAdmins++;
  }
  if (adminCount - removedAdmins < 1)
    return { ...blocked("Admin terakhir tidak boleh dinonaktifkan."), accounts };
  return {
    ...accepted(
      mode === "sessions"
        ? "Sesi pilihan dicabut dalam simulasi; akun tetap tersedia."
        : "Pembatasan akun disimulasikan dan sesi terkait dicabut. Histori tetap tersimpan.",
    ),
    accounts: accounts.map((account) =>
      selected.includes(account.id)
        ? {
            ...account,
            status: mode === "restrict" ? "Dibatasi" : account.status,
            sessions: 0,
            version: account.version + 1,
          }
        : account,
    ),
  };
}
export function mayChangeScope(actorId: string, accountId: string, grant: boolean) {
  return actorId !== accountId && !grant;
}
