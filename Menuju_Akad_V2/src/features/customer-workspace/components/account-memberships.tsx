"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AccountMembershipHistory, type MembershipAudit } from "./account-membership-history";
type Membership = {
  id: string;
  name: string;
  role: string;
  revision: number;
  partner: string | null;
  partnerEmail: string | null;
  invite: string | null;
};
export function AccountMemberships({ id, email }: { id: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [history, setHistory] = useState<MembershipAudit[]>([]);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  async function load() {
    const response = await fetch(
      `/api/superadmin/workspace-memberships?account=${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("Keanggotaan belum dapat dimuat.");
    const data = (await response.json()) as {
      memberships: Membership[];
      history: MembershipAudit[];
    };
    setMemberships(data.memberships);
    setHistory(data.history);
  }
  async function show() {
    setOpen(true);
    setBusy(true);
    setMessage("");
    setSelected(null);
    setReason("");
    try {
      await load();
    } catch {
      setMessage("Keanggotaan belum dapat dimuat.");
    } finally {
      setBusy(false);
    }
  }
  async function revoke(item: Membership) {
    if (!item.partner || !reason.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/superadmin/workspace-memberships", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceId: item.id,
          target: item.partner,
          revision: item.revision,
          reason,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Akses belum dapat dicabut.");
      setReason("");
      setSelected(null);
      await load();
      setMessage("Akses pasangan dicabut. Data workspace tetap tersimpan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Akses belum dapat dicabut.");
    } finally {
      setBusy(false);
    }
  }
  async function cancelInvite(item: Membership) {
    if (!item.invite || !reason.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/superadmin/workspace-memberships", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "cancel_invite",
          workspaceId: item.id,
          invite: item.invite,
          reason,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Undangan belum dapat dibatalkan.");
      setReason("");
      setSelected(null);
      await load();
      setMessage("Undangan pasangan dibatalkan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Undangan belum dapat dibatalkan.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button variant="secondary" size="small" onClick={() => void show()}>
        Keanggotaan
      </Button>
      <Dialog
        open={open}
        title="Keanggotaan workspace"
        onClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <div className="space-y-4">
          <p>{email}</p>
          <p className="text-sm">
            Role akun mengatur akses operasi. Pemilik dan pasangan adalah role yang terpisah di
            workspace. Di workspace, pemilik dapat mengundang atau mencabut pasangan; superadmin
            dapat mencabut akses dengan alasan. Pemilik dan pasangan dapat mengelola data
            perencanaan sesuai izin tindakan, paket, dan ketersediaan fitur.
          </p>
          {busy && <p role="status">Memuat atau menyimpan...</p>}
          {!busy && !message && !memberships.length && <p>Tidak ada keanggotaan workspace.</p>}
          <label className="grid gap-1 text-sm">
            Alasan pencabutan
            <textarea
              value={reason}
              maxLength={500}
              disabled={busy}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-control border border-ux-border p-2"
            />
          </label>
          {memberships.map((item) => (
            <div key={item.id} className="space-y-2 rounded-control border border-ux-border p-3">
              <p>
                {item.name || "Workspace tanpa nama"} -{" "}
                {item.role === "owner" ? "Pemilik" : "Pasangan"}
              </p>
              <p className="text-sm">ID: {item.id}</p>
              {item.partner && <p className="text-sm">Pasangan: {item.partnerEmail}</p>}
              {item.invite && selected !== `invite:${item.id}` && (
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => setSelected(`invite:${item.id}`)}
                >
                  Batalkan undangan pasangan
                </Button>
              )}
              {item.invite && selected === `invite:${item.id}` && (
                <div className="space-y-2">
                  <p>Tautan undangan yang aktif tidak dapat digunakan lagi.</p>
                  <Button disabled={busy || !reason.trim()} onClick={() => void cancelInvite(item)}>
                    Konfirmasi pembatalan undangan
                  </Button>{" "}
                  <Button variant="secondary" disabled={busy} onClick={() => setSelected(null)}>
                    Batal
                  </Button>
                </div>
              )}
              {item.partner && selected !== item.id && (
                <Button variant="secondary" disabled={busy} onClick={() => setSelected(item.id)}>
                  Cabut akses pasangan
                </Button>
              )}
              {item.partner && selected === item.id && (
                <div className="space-y-2">
                  <p>Pasangan akan kehilangan akses ke workspace ini. Data tetap tersimpan.</p>
                  <Button disabled={busy || !reason.trim()} onClick={() => void revoke(item)}>
                    Konfirmasi pencabutan
                  </Button>{" "}
                  <Button variant="secondary" disabled={busy} onClick={() => setSelected(null)}>
                    Batal pencabutan
                  </Button>
                </div>
              )}
            </div>
          ))}
          {message && <p role="status">{message}</p>}
          <AccountMembershipHistory history={history} />
        </div>
      </Dialog>
    </>
  );
}
