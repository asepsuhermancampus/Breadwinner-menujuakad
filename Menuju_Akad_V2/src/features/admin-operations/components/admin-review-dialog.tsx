"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { reviewAdminItem } from "../domain/admin-review";
import type { ReviewContext, ReviewDecision, ReviewItem, ReviewState } from "../types/admin";
type Props = {
  item: ReviewItem;
  kind: "kyb" | "moderation";
  action: ReviewDecision["action"];
  state: ReviewState;
  context: ReviewContext;
  onState: (state: ReviewState) => void;
  onClose: () => void;
  onSimulateVersion: () => void;
};
export function AdminReviewDialog({
  item,
  kind,
  action,
  state,
  context,
  onState,
  onClose,
  onSimulateVersion,
}: Props) {
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);
  const [operationId] = useState(() => crypto.randomUUID());
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [discard, setDiscard] = useState(false);
  const changed = state[kind].find((row) => row.id === item.id)?.version !== item.version;
  function close() {
    if (reason && !done) setDiscard(true);
    else onClose();
  }
  function confirm(event: React.FormEvent) {
    event.preventDefault();
    const result = reviewAdminItem(
      state,
      {
        kind,
        id: item.id,
        expectedVersion: item.version,
        action,
        reason,
        acknowledged: ack,
        operationId,
      },
      context,
    );
    setMessage(result.message);
    if (result.ok) {
      onState(result.state);
      setDone(true);
    }
  }
  return (
    <>
      <Dialog open title={`Tinjau ${item.id} · v${item.version}`} onClose={close}>
        <form onSubmit={confirm} className="grid gap-5">
          <p className="text-sm leading-relaxed text-secondary">
            {item.vendor} · {item.kind}. Keputusan hanya berlaku pada snapshot v{item.version}.{" "}
            {action === "false-positive"
              ? "Scanner memberi sinyal; Anda mencatat penilaian manusia."
              : "Perubahan dan alasan akan dicatat pada audit simulasi."}
          </p>
          <blockquote className="rounded-control bg-subtle p-4 text-sm">{item.excerpt}</blockquote>
          <Field
            label="Alasan keputusan"
            required
            minLength={10}
            maxLength={500}
            disabled={done}
            hint="Jelaskan hasil pemeriksaan; minimal 10 karakter."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              className="mt-1 shrink-0"
              checked={ack}
              disabled={done}
              onChange={(e) => setAck(e.target.checked)}
            />
            Saya sudah meninjau bukti, kebijakan dan versi konten ini.
          </label>
          {changed && (
            <p role="alert" className="text-sm text-danger">
              Versi berubah saat review. Tutup dan tinjau snapshot terbaru sebelum memutuskan.
            </p>
          )}
          {message && (
            <p role={done ? "status" : "alert"} className="text-sm leading-relaxed">
              {message}
            </p>
          )}
          {!done && (
            <details className="text-xs text-secondary">
              <summary className="min-h-11 py-3">Skenario internal</summary>
              <Button variant="secondary" size="small" onClick={onSimulateVersion}>
                Simulasikan versi baru saat review
              </Button>
            </details>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={close}>
              {done ? "Selesai" : "Kembali"}
            </Button>
            {!done && (
              <Button
                type="submit"
                className="bg-primary"
                disabled={!ack || reason.trim().length < 10 || changed}
              >
                Konfirmasi keputusan
              </Button>
            )}
          </div>
        </form>
      </Dialog>
      <Dialog open={discard} title="Tutup draf keputusan?" onClose={() => setDiscard(false)}>
        <p className="text-sm text-secondary">
          Alasan ini belum disimpan pada audit. Pilih lanjutkan untuk mempertahankan draf.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setDiscard(false)}>
            Lanjutkan tinjauan
          </Button>
          <Button variant="danger" onClick={onClose}>
            Abaikan draf
          </Button>
        </div>
      </Dialog>
    </>
  );
}
