"use client";
import { createHistoryDocument } from "../content/editor-content";
import type { StudioEditor } from "../hooks/use-studio-editor";
import { StudioHistory } from "./studio-history";
import { StudioReview } from "./studio-review";
import { StudioPreview } from "./studio-preview";
import { StudioSettings } from "./studio-settings";
import { StudioProjectActions } from "./studio-project-actions";
import { StudioExit } from "./studio-exit";
export type StudioModal =
  | "history"
  | "review"
  | "preview"
  | "active-preview"
  | "history-preview"
  | "settings"
  | "project"
  | "exit"
  | null;
export function StudioDialogs({
  editor,
  modal,
  setModal,
  viewport,
  onFix,
  onExit,
}: {
  editor: StudioEditor;
  modal: StudioModal;
  setModal: (value: StudioModal) => void;
  viewport: number;
  onFix: () => void;
  onExit: () => void;
}) {
  const close = () => setModal(null);
  return (
    <>
      {modal === "history" && (
        <StudioHistory
          editor={editor}
          onClose={close}
          onPreview={() => setModal("history-preview")}
        />
      )}
      {modal === "review" && <StudioReview editor={editor} onClose={close} onFix={onFix} />}
      {(modal === "preview" || modal === "history-preview" || modal === "active-preview") && (
        <StudioPreview
          document={
            modal === "history-preview"
              ? createHistoryDocument(editor.state.document)
              : modal === "active-preview"
                ? (editor.state.activeDocument ?? editor.state.document)
                : editor.state.document
          }
          viewport={viewport}
          onClose={() => (modal === "history-preview" ? setModal("history") : close())}
        />
      )}
      {modal === "settings" && (
        <StudioSettings editor={editor} onClose={close} onReview={() => setModal("review")} />
      )}
      {modal === "project" && <StudioProjectActions editor={editor} onClose={close} />}
      {modal === "exit" && <StudioExit editor={editor} onClose={close} onExit={onExit} />}
    </>
  );
}
