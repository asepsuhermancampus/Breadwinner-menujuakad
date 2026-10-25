"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPublishBlockers } from "../domain/editor-reducer";
import type { StudioEditor } from "../hooks/use-studio-editor";
export function CustomerStudioReview({
  editor,
  onClose,
  onFix,
}: {
  editor: StudioEditor;
  onClose: () => void;
  onFix: () => void;
}) {
  const [ack, setAck] = useState(false),
    [submitted, setSubmitted] = useState(false);
  const blockers = getPublishBlockers(editor.state);
  const published =
    submitted &&
    !editor.persisting &&
    !editor.storageError &&
    editor.state.document.publication === "published";
  if (editor.trial)
    return (
      <Dialog open title="Masuk untuk menerbitkan undangan" onClose={onClose}>
        <p className="mb-4 text-sm">
          Draf dapat disimpan di browser. Masuk dan gunakan paket yang sesuai untuk menerbitkan
          undangan kalian.
        </p>
        <a href="/login?returnTo=%2Fplanner%2Finvitations%2Fstudio" className="underline">
          Masuk atau daftar
        </a>
      </Dialog>
    );
  return (
    <Dialog
      open
      title={published ? "Undangan sudah diterbitkan" : "Tinjau undangan kalian"}
      onClose={onClose}
    >
      <div className="space-y-4 text-sm">
        <p>
          {editor.state.document.content.coupleTitle} · {editor.state.document.content.venue}
        </p>
        {published ? (
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href={`/studio-invitation/${encodeURIComponent(editor.workspaceId)}/${encodeURIComponent(editor.state.document.projectId)}`}
          >
            Buka undangan publik
          </a>
        ) : (
          <>
            <p>
              Snapshot yang diterbitkan tersimpan pada akun. Perubahan draf berikutnya tetap
              terpisah dari versi publik.
            </p>
            {blockers.length > 0 && (
              <ul role="alert" className="list-disc pl-5">
                {blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            <label className="flex gap-2">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
              Saya sudah memeriksa konten yang akan ditampilkan kepada tamu.
            </label>
            <Button
              disabled={
                !ack ||
                blockers.length > 0 ||
                editor.persisting ||
                Boolean(editor.storageError) ||
                submitted
              }
              onClick={() => {
                setSubmitted(true);
                editor.dispatch({
                  type: "publish",
                  acknowledged: true,
                  expectedVersion: editor.state.document.expectedVersion,
                  operationId: crypto.randomUUID(),
                });
              }}
            >
              Terbitkan undangan
            </Button>
            {blockers.length > 0 && (
              <Button variant="secondary" onClick={onFix}>
                Perbaiki draf
              </Button>
            )}
          </>
        )}
        {editor.persisting && <p role="status">Menyimpan pada akun…</p>}
        {editor.storageError && (
          <p role="alert">{editor.storageError}. Muat ulang data server sebelum mencoba lagi.</p>
        )}
      </div>
    </Dialog>
  );
}
