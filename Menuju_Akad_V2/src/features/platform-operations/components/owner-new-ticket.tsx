import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OperationDialog as Dialog } from "./operation-panel";
import { Field } from "@/components/ui/field";
import { Status } from "@/components/ui/status";
import { guardOperation } from "../domain/guards";
import type { GateContext } from "../types/operations";
export function OwnerNewTicket({
  onClose,
  onCreate,
  context,
}: {
  onClose: () => void;
  onCreate: (title: string, body: string) => void;
  context: (action: string, version: number) => GateContext;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [discard, setDiscard] = useState(false);
  const [error, setError] = useState("");
  function submit() {
    const gate = guardOperation({
      ...context("tickets.write", 1),
      actorId: "andi",
      ownerId: "andi",
    });
    if (!gate.ok) {
      setError(gate.message);
      return;
    }
    if (subject.trim().length < 5 || body.trim().length < 12) {
      setError("Isi topik minimal 5 karakter dan pertanyaan minimal 12 karakter.");
      return;
    }
    if (/\b(?:\d[\s-]?){10,}\b/.test(body)) {
      setError("Hapus nomor rekening, KTP atau data sensitif lengkap.");
      return;
    }
    onCreate(subject.trim(), body.trim());
    onClose();
  }
  return (
    <Dialog
      open
      onClose={() => (subject || body ? setDiscard(true) : onClose())}
      title="Buat tiket bantuan pribadi"
    >
      <div className="grid gap-4">
        {discard ? (
          <>
            <Status tone="warning">Draf belum dikirim. Buang perubahan?</Status>
            <Button onClick={() => setDiscard(false)}>Kembali ke draf</Button>
            <Button variant="danger" onClick={onClose}>
              Buang draf
            </Button>
          </>
        ) : (
          <>
            <Field
              label="Topik bantuan"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <label htmlFor="new-ticket-body" className="grid gap-2 text-sm font-medium">
              Pertanyaan
              <textarea
                id="new-ticket-body"
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="min-w-0 rounded-control border border-ux-control-border p-3"
              />
            </label>
            <Status>
              Jangan kirim PIN, OTP, nomor rekening lengkap atau KTP. Tiket pribadi hanya untuk Anda
              dan petugas yang ditugaskan.
            </Status>
            {error && <Status tone="danger">{error}</Status>}
            <Button onClick={submit}>Kirim tiket simulasi</Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
