"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { StudioEditor } from "../hooks/use-studio-editor";

type Action = "unpublish" | "archive" | "delete" | "revoke-tickets" | "duplicate" | "new";
const actions: [Action, string, string][] = [
  ["new", "Undangan baru", "Membuat proyek draf terpisah. Proyek ini tetap disimpan."],
  [
    "duplicate",
    "Duplikat proyek",
    "Menyalin desain ke proyek draf baru. Tamu dan RSVP tidak disalin.",
  ],
  [
    "unpublish",
    "Tarik laman dari publik",
    "Konten dan form RSVP tidak tersedia pada simulasi lokal. Data tetap disimpan; tiket tidak dicabut.",
  ],
  ["archive", "Arsipkan draf", "Draf ini diarsipkan. Versi yang aktif untuk tamu tidak berubah."],
  [
    "delete",
    "Hapus draf",
    "Hapus draf lokal dari pengeditan. Snapshot aktif, data tamu, serta tiket tetap tersimpan.",
  ],
  [
    "revoke-tickets",
    "Cabut tiket secara terpisah",
    "Tiket simulasi dicabut setelah konfirmasi ini. Menarik laman tidak mencabut tiket.",
  ],
];
export function StudioProjectActions({
  editor,
  onClose,
}: {
  editor: StudioEditor;
  onClose: () => void;
}) {
  const [action, setAction] = useState<Action>("duplicate");
  const [ack, setAck] = useState(false);
  const item = actions.find(([key]) => key === action)!;
  return (
    <Dialog open onClose={onClose} title="Kelola proyek & publikasi">
      <div className="grid gap-4 text-sm">
        <p className="text-xs text-secondary">
          Objek: {editor.state.document.title} · draf v{editor.state.document.revision} · publik{" "}
          {editor.state.document.activeVersion ?? "belum ada"}
        </p>
        <label className="grid gap-2 text-xs">
          Tindakan
          <select
            className="min-h-11 rounded-control border border-border px-2"
            value={action}
            onChange={(event) => {
              setAction(event.target.value as Action);
              setAck(false);
            }}
          >
            {actions
              .filter(([key]) => !editor.remote || key !== "revoke-tickets")
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </label>
        <p className="rounded-control bg-subtle p-4 text-xs leading-relaxed">
          {editor.trial
            ? "Perubahan ini disimpan di browser setelah menekan Simpan draf trial. Publikasi memerlukan akun."
            : editor.remote
              ? "Perubahan proyek disimpan pada akun. Menarik undangan menghentikan akses ke laman publik setelah penyimpanan berhasil."
              : item[2]}
        </p>
        <label className="flex min-h-11 items-center gap-3 text-xs">
          <input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} />
          Saya memahami dampak tindakan ini.
        </label>
        <Button
          variant={action === "delete" || action === "revoke-tickets" ? "danger" : "primary"}
          disabled={!ack || !editor.state.environment.canEdit}
          onClick={() => {
            if (action === "new" || action === "duplicate")
              editor.dispatch({ type: action, projectId: `inv-${action}-${crypto.randomUUID()}` });
            else editor.dispatch({ type: action });
            onClose();
          }}
        >
          Konfirmasi {item[1].toLowerCase()}
        </Button>
        <p className="text-xs text-secondary">
          {editor.remote
            ? "Tunggu konfirmasi penyimpanan pada akun sebelum menutup studio."
            : "Tindakan ini hanya pada data contoh lokal. Otorisasi dan kebijakan server produksi masih memerlukan integrasi."}
        </p>
      </div>
    </Dialog>
  );
}
