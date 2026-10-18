"use client";

import { useState } from "react";
import {
  moderationItems,
  moderationSummary,
} from "@/features/invitation-manager/content/moderation-content";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { ModerationItem } from "../types/manager";

export function ModerationPanel() {
  const [items, setItems] = useState<ModerationItem[]>(moderationItems);
  const [active, setActive] = useState<ModerationItem | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  function decide(id: string, status: ModerationItem["status"]) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    setActive(null);
  }

  const pending = items.filter((m) => m.status === "Menunggu");

  return (
    <section className="grid gap-4" aria-label="Moderasi ucapan dan foto">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Menunggu",
            value: String(moderationSummary.pendingTotal),
            note: `${moderationSummary.pendingWishes} ucapan · ${moderationSummary.pendingPhotos} foto`,
          },
          {
            label: "Ditampilkan",
            value: String(moderationSummary.shown),
            note: "Disetujui oleh pasangan",
          },
          {
            label: "Disembunyikan",
            value: String(moderationSummary.hidden),
            note: "Tidak terlihat publik",
          },
          {
            label: "Mode moderasi",
            value: moderationSummary.mode,
            note: "Tidak otomatis menerbitkan unggahan",
          },
        ].map((m) => (
          <div key={m.label} className="rounded-card border border-border bg-surface p-4">
            <p className="text-[10px] font-bold tracking-widest text-secondary">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-card border border-border bg-surface">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-canvas text-secondary">
                <th className="p-3 font-semibold">Tamu</th>
                <th className="p-3 font-semibold">Jenis</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="p-3 font-semibold text-foreground">{m.guest}</td>
                  <td className="p-3 text-secondary">{m.kind}</td>
                  <td
                    className={`p-3 font-semibold ${m.status === "Menunggu" ? "text-warning" : m.status === "Ditampilkan" ? "text-success" : "text-muted"}`}
                  >
                    {m.status}
                  </td>
                  <td className="p-3 font-mono text-secondary">{m.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-border p-3 text-[11px] text-muted">
            {pending.length} dari {moderationSummary.pendingTotal} kiriman menunggu ditampilkan
          </p>
          <div className="border-t border-border p-4">
            <p className="text-xs font-bold text-foreground">Persetujuan dapat ditarik</p>
            <p className="mt-1 text-xs text-secondary">
              Menyembunyikan konten bukan menghapus jejak keputusan. Penarikan foto ditangani sesuai
              kebijakan retensi, bukan dipertahankan selamanya.
            </p>
          </div>
        </div>

        <div className="grid content-start gap-3 rounded-card border border-border bg-surface p-5">
          <h3 className="text-sm font-bold text-foreground">Tinjau kiriman</h3>
          {items
            .filter((m) => m.status === "Menunggu")
            .map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(m)}
                className="flex items-center justify-between rounded-control border border-border bg-canvas px-3 py-2.5 text-left hover:bg-subtle"
              >
                <span>
                  <span className="block text-xs font-semibold text-foreground">{m.guest}</span>
                  <span className="text-[11px] text-secondary">
                    {m.kind} · {m.submittedAt}
                  </span>
                </span>
                <span className="text-xs font-bold text-primary">Tinjau →</span>
              </button>
            ))}
          {pending.length === 0 && (
            <p className="rounded-control border border-success/30 bg-success-bg p-3 text-xs text-success">
              Semua kiriman sudah ditinjau pada pratinjau ini.
            </p>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `Kiriman dari ${active.guest}` : "Tinjau"}
      >
        {active && (
          <div className="grid gap-3">
            {active.photo && (
              <img
                src={active.photo}
                alt={`Foto kiriman ${active.guest}`}
                className="max-h-64 w-full rounded-control object-cover"
              />
            )}
            {active.body && (
              <p className="rounded-control bg-canvas p-3 text-sm text-foreground">
                “{active.body}”
              </p>
            )}
            <p className="text-xs text-secondary">Nama publik: {active.publicName}</p>
            <p className="text-[11px] text-muted">{active.consentEvidence}</p>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectOpen(true);
                }}
              >
                Tolak dengan alasan…
              </Button>
              <Button onClick={() => decide(active.id, "Ditampilkan")}>Setujui</Button>
            </div>
            <Dialog
              open={rejectOpen}
              onClose={() => setRejectOpen(false)}
              title="Tolak dengan alasan"
            >
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-foreground">
                  Alasan (dicatat pada audit)
                </span>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-control border border-border bg-canvas p-2.5 text-sm"
                />
              </label>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setRejectOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="secondary"
                  disabled={!reason.trim()}
                  onClick={() => {
                    decide(active.id, "Disembunyikan");
                    setRejectOpen(false);
                    setReason("");
                  }}
                >
                  Sembunyikan kiriman
                </Button>
              </div>
            </Dialog>
          </div>
        )}
      </Dialog>
    </section>
  );
}
