"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AdminReviewInspector } from "./admin-review-inspector";
import { AdminReviewTable } from "./admin-review-table";
import type { ReviewContext, ReviewDecision, ReviewItem, ReviewState } from "../types/admin";
import { AdminReviewDialog } from "./admin-review-dialog";
type Props = {
  kind: "kyb" | "moderation";
  state: ReviewState;
  onState: (state: ReviewState) => void;
  context: ReviewContext;
};
export function AdminReviewBoard({ kind, state, onState, context }: Props) {
  const [selected, setSelected] = useState("");
  const [action, setAction] = useState<ReviewDecision["action"]>("revision");
  const [snapshot, setSnapshot] = useState<ReviewItem | null>(null);
  const [proof, setProof] = useState(false);
  const [notice, setNotice] = useState("");
  const isKyb = kind === "kyb";
  const rows = state[kind];
  const item = rows.find((row) => row.id === selected) ?? rows[0]!;
  const pending =
    (isKyb ? 9 : 6) -
    rows.filter((row) => !["pending", "revision-required"].includes(row.status)).length;
  const allowed =
    context.role === "superadmin" && context.canReview && context.sessionValid && context.online;
  function openProof() {
    if (!allowed) {
      setNotice("Akses dokumen memerlukan izin pemeriksa aktif.");
      return;
    }
    onState({
      ...state,
      audit: [
        ...state.audit,
        {
          id: crypto.randomUUID(),
          objectId: item.id,
          actor: context.actor,
          reason: "Membuka ringkasan dokumen privat simulasi",
          version: item.version,
          action: "document.open",
          at: new Date().toISOString(),
        },
      ],
    });
    setProof(true);
  }
  function nextVersion() {
    onState({
      ...state,
      [kind]: rows.map((row) =>
        row.id === item.id
          ? { ...row, version: row.version + 1, status: "pending", proofComplete: false }
          : row,
      ),
    });
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            {isKyb
              ? "Tinjau bukti. Bukan sekadar centang."
              : "Scanner memberi sinyal. Manusia memutuskan."}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {isKyb
              ? `${pending} pengajuan dalam antrean · contoh pemeriksaan pembaruan rekening, bukan pendaftaran ulang usaha.`
              : `${pending} caption perlu ditinjau · keputusan hanya berlaku pada versi konten yang diperiksa.`}
          </p>
        </div>
        <Button
          className="bg-primary"
          disabled={!allowed}
          onClick={() => setSnapshot(structuredClone(item))}
        >
          {isKyb ? "Simpan keputusan tinjauan" : "Simpan keputusan moderasi"}
        </Button>
      </div>
      {!allowed && (
        <p role="alert" className="rounded-control bg-warning-bg p-4 text-sm text-warning">
          Izin pemeriksa atau koneksi tidak tersedia. Data lama dan draf tetap dipertahankan.
        </p>
      )}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="grid content-start gap-6">
          <AdminReviewTable rows={rows} item={item} isKyb={isKyb} onSelect={setSelected} />
          <div className="grid gap-2 border-t border-ux-border pt-5">
            <p className="text-sm font-semibold">
              {isKyb ? "Akses dokumen tercatat" : "Bukan alasan blokir otomatis"}
            </p>
            <p className="text-sm leading-relaxed text-secondary">
              {isKyb
                ? "4 dari 9 ditampilkan. Hanya pemeriksa berizin dapat membuka dokumen mentah; BA dan staf helpdesk tidak otomatis mendapat akses."
                : "Angka ukuran 20 × 30 cm bukan nomor telepon. Reviewer dapat menandai false positive dengan alasan; KYB dan akun tidak otomatis ditolak."}
            </p>
          </div>
        </div>
        <AdminReviewInspector
          item={item}
          isKyb={isKyb}
          action={action}
          allowed={allowed}
          onAction={setAction}
          onReview={() => setSnapshot(structuredClone(item))}
          onProof={openProof}
        />
      </div>
      {notice && (
        <p role="status" className="text-sm">
          {notice}
        </p>
      )}
      <details className="text-xs text-secondary">
        <summary className="min-h-11 py-3">
          Audit lokal pemeriksaan · {state.audit.length} catatan
        </summary>
        <ul className="grid gap-3">
          {state.audit.map((entry) => (
            <li key={entry.id}>
              {entry.objectId} v{entry.version} · {entry.actor} · {entry.action} · {entry.reason}
            </li>
          ))}
        </ul>
      </details>
      {snapshot && (
        <AdminReviewDialog
          item={snapshot}
          kind={kind}
          action={action}
          state={state}
          context={context}
          onState={onState}
          onClose={() => setSnapshot(null)}
          onSimulateVersion={nextVersion}
        />
      )}
      <Dialog
        open={proof}
        title="Ringkasan dokumen privat · simulasi"
        onClose={() => setProof(false)}
      >
        <div className="grid gap-4 text-sm leading-relaxed">
          <p>
            bukti_rekening.pdf · {item.id} v{item.version}
          </p>
          <p>
            Nama pemilik terpotong pada bukti fixture. Dokumen mentah tidak tersedia pada adapter
            lokal ini. Tidak ada berkas identitas atau nomor rekening lengkap yang dibuka.
          </p>
          <p className="text-secondary">
            Akses ringkasan dicatat pada audit. Ekspor publik tidak menyertakan dokumen sensitif.
          </p>
        </div>
      </Dialog>
    </>
  );
}
