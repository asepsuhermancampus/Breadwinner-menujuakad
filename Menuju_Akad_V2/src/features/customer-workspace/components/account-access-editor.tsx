"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
type Account = {
  id: string;
  email: string;
  role: "customer" | "admin" | "vendor" | "ambassador";
  active: boolean;
  version: number;
};
export function AccountAccessEditor({ account }: { account: Account }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(account.role);
  const [active, setActive] = useState(account.active);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save() {
    if (busy || !reason.trim()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/superadmin/accounts/${encodeURIComponent(account.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          role,
          active,
          expected: { role: account.role, active: account.active, version: account.version },
          reason,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Perubahan belum tersimpan.");
      setOpen(false);
      setReason("");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={() => {
          setRole(account.role);
          setActive(account.active);
          setError("");
          setOpen(true);
        }}
      >
        Atur akses
      </Button>
      <Dialog
        open={open}
        title="Atur akses akun"
        onClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <div className="space-y-4">
          <p className="text-xs font-mono font-medium text-foreground">{account.email}</p>
          <label className="grid gap-1 text-sm">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Account["role"])}
              className="rounded-control border border-ux-border p-2"
            >
              <option value="customer">Pelanggan</option>
              <option value="admin">Admin</option>
              <option value="vendor">Vendor</option>
              <option value="ambassador">Brand Ambassador</option>
            </select>
          </label>
          <label className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />{" "}
            Akun aktif
          </label>
          <label className="grid gap-1 text-sm">
            Alasan perubahan
            <textarea
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-control border border-ux-border p-2"
            />
          </label>
          {error && (
            <p role="alert" className="text-danger">
              {error} Jika data berubah, tutup dialog dan muat ulang halaman.
            </p>
          )}
          <div className="flex gap-3">
            <Button
              disabled={
                busy || !reason.trim() || (role === account.role && active === account.active)
              }
              onClick={() => void save()}
            >
              {busy ? "Menyimpan…" : "Simpan perubahan akses"}
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => setOpen(false)}>
              Batal
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
