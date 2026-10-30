import Link from "next/link";
import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { getAccounts } from "@/server/identity/runtime";
import { listAccountDirectory } from "@/server/identity/account-directory";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { AccountAccessEditor } from "@/features/customer-workspace/components/account-access-editor";
import { AccountMemberships } from "@/features/customer-workspace/components/account-memberships";
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
      `SELECT audit.old_role,audit.new_role,audit.old_active,audit.new_active,audit.reason,audit.created_at, actor.email AS actor_email, target.email AS target_email FROM account_access_audit audit LEFT JOIN accounts actor ON actor.id=audit.actor LEFT JOIN accounts target ON target.id=audit.target ORDER BY audit.id DESC LIMIT 30`,
    )
    .all();
  const href = (next: number) =>
    `/superadmin/accounts?${new URLSearchParams({ q: query, page: String(next) })}`;
  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/accounts">
      <section className="max-w-4xl space-y-5">
        <div>
          <h1 className="text-2xl font-semibold">Pengguna</h1>
          <p className="mt-2 text-sm text-secondary">
            Cari akun berdasarkan nama atau email. Perubahan akses tercatat dan mengeluarkan sesi
            akun yang diubah.
          </p>
        </div>
        <form className="flex flex-wrap items-end gap-3" action="/superadmin/accounts">
          <label className="grid gap-1 text-sm">
            Nama atau email
            <input
              className="rounded-control border border-ux-border p-2"
              name="q"
              maxLength={100}
              defaultValue={query}
            />
          </label>
          <button
            className="customer-control rounded-control bg-primary px-4 text-on-primary"
            type="submit"
          >
            Cari
          </button>
        </form>
        {accounts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="p-3">Nama</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((item) => (
                  <tr key={item.id} className="border-t border-ux-border">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.role}</td>
                    <td className="p-3">{item.active ? "Aktif" : "Tidak aktif"}</td>
                    <td className="p-3">
                      <AccountMemberships id={item.id} email={item.email} />{" "}
                      {item.role === "customer" || item.role === "admin" ? (
                        <AccountAccessEditor
                          key={`${item.id}:${item.version}`}
                          account={{
                            id: item.id,
                            email: item.email,
                            role: item.role,
                            active: item.active,
                            version: item.version,
                          }}
                        />
                      ) : (
                        "Dilindungi"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Tidak ada akun yang cocok.</p>
        )}
        <nav aria-label="Halaman pengguna" className="flex gap-4 text-sm">
          {page > 1 && (
            <Link className="underline" href={href(page - 1)}>
              Sebelumnya
            </Link>
          )}
          <span>Halaman {page}</span>
          {hasMore && (
            <Link className="underline" href={href(page + 1)}>
              Berikutnya
            </Link>
          )}
        </nav>
        <section>
          <h2 className="text-lg font-semibold">Riwayat perubahan akses</h2>
          {history.length ? (
            <ul className="mt-3 space-y-3">
              {history.map((entry, index) => (
                <li
                  key={`${String(entry.created_at)}-${index}`}
                  className="rounded-card border border-ux-border p-3 text-sm"
                >
                  <p>
                    {String(entry.target_email ?? "Akun tidak tersedia")} · {String(entry.old_role)}{" "}
                    → {String(entry.new_role)} · {entry.new_active ? "Aktif" : "Tidak aktif"}
                  </p>
                  <p>{String(entry.reason)}</p>
                  <p className="text-secondary">
                    {String(entry.actor_email ?? "Admin tidak tersedia")} ·{" "}
                    {String(entry.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Belum ada perubahan akses.</p>
          )}
        </section>
      </section>
    </LiveOperationsShell>
  );
}
