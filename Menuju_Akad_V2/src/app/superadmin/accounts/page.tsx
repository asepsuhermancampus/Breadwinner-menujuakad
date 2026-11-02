import Link from "next/link";
import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { getAccounts } from "@/server/identity/runtime";
import { listAccountDirectory } from "@/server/identity/account-directory";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { AccountAccessEditor } from "@/features/customer-workspace/components/account-access-editor";
import { AccountMemberships } from "@/features/customer-workspace/components/account-memberships";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const requestedPage = Number(params.page ?? "1");
  const page = Number.isSafeInteger(requestedPage)
    ? Math.min(10000, Math.max(1, requestedPage))
    : 1;
  const { accounts, hasMore } = listAccountDirectory(getAccounts().db, query, page);
  const history = getAccounts()
    .db.prepare(
      `SELECT audit.old_role,audit.new_role,audit.old_active,audit.new_active,audit.reason,audit.created_at, actor.email AS actor_email, target.email AS target_email FROM account_access_audit audit LEFT JOIN accounts actor ON actor.id=audit.actor LEFT JOIN accounts target ON target.id=audit.target ORDER BY audit.id DESC LIMIT 20`,
    )
    .all() as { old_role: string; new_role: string; old_active: number; new_active: number; reason: string; created_at: string; actor_email: string | null; target_email: string | null }[];

  const href = (next: number) =>
    `/superadmin/accounts?${new URLSearchParams({ q: query, page: String(next) })}`;

  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/accounts">
            <div className="space-y-6 w-full max-w-7xl pb-8">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-card border border-ux-border bg-surface p-5 shadow-xs">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Pengguna</h1>
                  <p className="mt-1 text-xs text-secondary sm:text-sm">Kelola peran akun dan izin akses platform.</p>
                </div>
                <form className="flex items-center gap-2" action="/superadmin/accounts">
                  <input
                    className="rounded-control border border-ux-border bg-canvas/50 px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-hidden min-w-[240px]"
                    name="q"
                    placeholder="Cari nama atau email..."
                    maxLength={100}
                    defaultValue={query}
                  />
                          <Button size="small" type="submit">Cari</Button>
                        </form>
        </header>

                    <div className="rounded-card border border-ux-border bg-surface overflow-hidden shadow-xs">
                      {accounts.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-canvas/50 border-b border-ux-border text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Peran</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ux-border">
                  {accounts.map((item) => (
                    <tr key={item.id} className="hover:bg-subtle/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                      <td className="px-4 py-3 text-secondary font-mono text-[11px]">{item.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold font-mono tracking-wider uppercase bg-subtle text-foreground">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${item.active ? "text-success" : "text-muted"}`}>
                          <span className={`size-1.5 rounded-full ${item.active ? "bg-success" : "bg-muted"}`} />
                          {item.active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <AccountMemberships id={item.id} email={item.email} />
                          {item.role === "customer" || item.role === "admin" || item.role === "vendor" || item.role === "ambassador" ? (
                            <AccountAccessEditor
                              key={`${item.id}:${item.version}`}
                              account={{ id: item.id, email: item.email, role: item.role, active: item.active, version: item.version }}
                            />
                          ) : (
                            <span className="text-[11px] text-muted italic px-2">Dilindungi</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-secondary">Tidak ada akun yang cocok.</div>
              )}
              <nav aria-label="Halaman pengguna" className="flex items-center justify-between border-t border-ux-border px-4 py-2.5 text-xs text-secondary bg-canvas/30">
                <span>Halaman {page}</span>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link className="rounded-control border border-ux-border bg-surface px-2.5 py-1 hover:bg-subtle" href={href(page - 1)}>
                      Sebelumnya
                    </Link>
                  )}
                  {hasMore && (
                    <Link className="rounded-control border border-ux-border bg-surface px-2.5 py-1 hover:bg-subtle" href={href(page + 1)}>
                      Berikutnya
                    </Link>
                  )}
                </div>
              </nav>
            </div>

            <section className="rounded-card border border-ux-border bg-surface p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Riwayat Audit Akses</h2>
                <span className="text-[11px] text-muted font-mono">{history.length} entri terbaru</span>
              </div>
                {history.length ? (
                    <div className="max-h-56 overflow-y-auto divide-y divide-ux-border border border-ux-border rounded-control">
                      {history.map((entry, index) => (
                <div key={`${String(entry.created_at)}-${index}`} className="p-3 text-xs space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{entry.target_email ?? "Akun tidak tersedia"}</span>
                    <span className="text-[11px] text-secondary font-mono">{String(entry.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="font-mono text-[10px] uppercase">{entry.old_role} → {entry.new_role}</span>
                    <span>·</span>
                    <span>{entry.new_active ? "Aktif" : "Nonaktif"}</span>
                    <span>·</span>
                    <span className="italic">{entry.reason || "Tanpa alasan"}</span>
                  </div>
                </div>
                      ))}
            </div>
              ) : (
              <p className="text-xs text-secondary">Belum ada perubahan akses.</p>
          )}
            </section>
        </div>
    </LiveOperationsShell>
  );
}
