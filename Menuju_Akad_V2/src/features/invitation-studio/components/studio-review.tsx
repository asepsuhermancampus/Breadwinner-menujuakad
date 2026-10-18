"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPublishBlockers } from "../domain/editor-reducer";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioReview({
  editor,
  onClose,
  onFix,
}: {
  editor: StudioEditor;
  onClose: () => void;
  onFix: () => void;
}) {
  const { state, dispatch } = editor;
  const [snapshot] = useState(() => ({
    expectedVersion: state.document.expectedVersion,
    revision: state.document.revision,
    document: JSON.stringify(state.document),
    operationId: crypto.randomUUID(),
  }));
  const [ack, setAck] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const blockers = getPublishBlockers(state);
  const changed = !submitted && snapshot.document !== JSON.stringify(state.document);
  const done = Object.hasOwn(state.operations, snapshot.operationId);
  function publish() {
    if (blockers.length || changed || !ack || submitted) return;
    dispatch({
      type: "publish",
      expectedVersion: snapshot.expectedVersion,
      operationId: snapshot.operationId,
      acknowledged: ack,
    });
    setSubmitted(true);
  }
  return (
    <Dialog
      open
      onClose={onClose}
      title={
        done
          ? "Hasil publikasi simulasi"
          : blockers.length
            ? "Draf belum siap diterbitkan"
            : `Tinjau snapshot v${snapshot.revision}`
      }
    >
      <div className="grid gap-4 text-sm">
        {done ? (
          <>
            <p role="status" className="rounded-control bg-success-bg p-4 text-success">
              {unknown ? "Status operasi diperiksa: " : ""}Snapshot v
              {state.operations[snapshot.operationId]} diterbitkan pada simulasi lokal. Jawaban RSVP
              dan tiket tetap utuh.
            </p>
            <Button onClick={onClose}>Kembali ke studio</Button>
          </>
        ) : (
          <>
            <p>
              Versi aktif{" "}
              {state.document.activeVersion ? `v${state.document.activeVersion}` : "belum ada"} →
              draf v{snapshot.revision}. Publikasi di sini merupakan simulasi lokal.
            </p>
            <dl className="grid gap-3 rounded-control bg-subtle p-4 text-xs">
              <div>
                <dt className="font-semibold">Konten</dt>
                <dd>
                  {state.document.content.coupleTitle} · {state.document.content.venue}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Hak paket</dt>
                <dd>Premium · tidak ada biaya baru</dd>
              </div>
              <div>
                <dt className="font-semibold">Privasi & RSVP</dt>
                <dd>RSVP per sesi · hadiah nonaktif · kontak tidak dipublikasikan</dd>
              </div>
            </dl>
            {blockers.length > 0 && (
              <ul role="alert" className="list-disc space-y-2 pl-5 text-danger">
                {blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            )}
            {changed && (
              <p role="alert" className="text-warning">
                Draf berubah sejak review dibuka. Tutup dan tinjau snapshot terbaru.
              </p>
            )}
            <label className="flex min-h-11 items-start gap-3 py-2 text-xs leading-relaxed">
              <input
                type="checkbox"
                className="mt-1 shrink-0"
                checked={ack}
                onChange={(event) => setAck(event.target.checked)}
              />
              Saya sudah meninjau konten, sesi acara, dan privasi undangan ini.
            </label>
            <details className="text-xs text-secondary">
              <summary>Simulasi respons publikasi</summary>
              <label className="flex min-h-11 items-center gap-3">
                <input
                  type="checkbox"
                  checked={unknown}
                  onChange={(event) => setUnknown(event.target.checked)}
                />
                Respons awal tidak diketahui; periksa operasi yang sama
              </label>
            </details>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={blockers.length ? onFix : onClose}>
                {blockers.length ? "Perbaiki draf" : "Kembali mengedit"}
              </Button>
              <Button
                className="bg-primary"
                disabled={
                  blockers.length > 0 ||
                  changed ||
                  !ack ||
                  submitted ||
                  Boolean(editor.storageError)
                }
                onClick={publish}
              >
                Konfirmasi & terbitkan v{snapshot.revision}
              </Button>
            </div>
            <p className="text-xs text-secondary">
              Versi, akses, paket, dan availability diperiksa ulang saat konfirmasi. Tidak ada
              publikasi ke server produksi.
            </p>
          </>
        )}
      </div>
    </Dialog>
  );
}
