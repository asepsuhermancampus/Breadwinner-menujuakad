import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OperationDialog as Dialog } from "./operation-panel";
import { Field } from "@/components/ui/field";
import { Status } from "@/components/ui/status";
import { publishContent, saveContentDraft } from "../domain/cms";
import type { ContentEntry, Feedback } from "../types/operations";
import type { PanelProps } from "../types/panel";
import { CheckLine } from "./operation-ui";
type Props = Pick<PanelProps, "context"> & {
  entry: ContentEntry;
  onClose: () => void;
  onSave: (entry: ContentEntry) => void;
};
export function CmsEditor({ entry, context, onClose, onSave }: Props) {
  const [text, setText] = useState(entry.text);
  const [discard, setDiscard] = useState(false);
  const [seo, setSeo] = useState(false);
  const [legal, setLegal] = useState(false);
  const [ack, setAck] = useState(false);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [review, setReview] = useState(false);
  const [expected] = useState(entry.draft ?? entry.active);
  function save(publish: boolean) {
    const gate = {
      ...context("cms.write", entry.draft ?? entry.active),
      expectedVersion: expected,
    };
    const result = publish
      ? publishContent({ entry, context: gate, seo, legal, acknowledged: ack, reason })
      : saveContentDraft(entry, text, gate);
    setFeedback(result);
    if (result.ok) {
      onSave(result.entry);
      onClose();
    }
  }
  function close() {
    if (text !== entry.text || reason.trim()) setDiscard(true);
    else onClose();
  }
  return (
    <Dialog
      open
      onClose={close}
      title={`${review ? "Review publikasi" : "Edit draf"} · ${entry.id}`}
      side
    >
      <div className="grid gap-4">
        <p className="text-sm text-secondary">
          Aktif v{entry.active} · {entry.draft ? `draf v${entry.draft}` : "belum ada draf"}. Konten
          global terpisah dari proyek Andi & Risa v3.
        </p>
        {discard ? (
          <>
            <Status tone="warning">Perubahan belum disimpan. Buang draf lokal ini?</Status>
            <Button variant="secondary" onClick={() => setDiscard(false)}>
              Lanjutkan mengedit
            </Button>
            <Button variant="danger" onClick={onClose}>
              Buang perubahan
            </Button>
          </>
        ) : (
          <>
            {!review ? (
              <>
                <label className="grid gap-2 text-sm font-medium" htmlFor="cms-text">
                  Konten draf
                  <textarea
                    id="cms-text"
                    rows={8}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    className="min-w-0 resize-y rounded-control border border-ux-control-border p-3 text-sm"
                  />
                </label>
                <Status>
                  Draf tidak diindeks. Simpan draf lebih dahulu untuk mereview versi baru.
                </Status>
                <Button onClick={() => save(false)}>Simpan versi draf</Button>
                <Button
                  variant="secondary"
                  disabled={text !== entry.text || !entry.draft}
                  onClick={() => setReview(true)}
                >
                  Review versi {entry.draft ?? "—"}
                </Button>
              </>
            ) : (
              <>
                <p className="rounded-control bg-ux-dock p-4 text-sm">{entry.text}</p>
                <CheckLine checked={seo} onChange={setSeo}>
                  Metadata SEO, judul dan indeks sudah direview.
                </CheckLine>
                <CheckLine checked={legal} onChange={setLegal}>
                  Dampak legal dan kebijakan privasi sudah direview.
                </CheckLine>
                <Field
                  label="Alasan publikasi"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
                <CheckLine checked={ack} onChange={setAck}>
                  Saya mengonfirmasi {entry.id} draf v{entry.draft}; ini tidak menulis ulang proyek
                  terbit atau entitlement pembeli.
                </CheckLine>
                <Button
                  disabled={!seo || !legal || !ack || reason.trim().length < 8}
                  onClick={() => save(true)}
                >
                  Konfirmasi publikasi simulasi
                </Button>
                <Button variant="ghost" onClick={() => setReview(false)}>
                  Kembali ke draf
                </Button>
              </>
            )}
            {feedback && (
              <Status tone={feedback.ok ? "success" : "danger"}>{feedback.message}</Status>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
