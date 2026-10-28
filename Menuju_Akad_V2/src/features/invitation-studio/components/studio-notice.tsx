import type { StudioEditor } from "../hooks/use-studio-editor";
export function StudioNotice({ editor }: { editor: StudioEditor }) {
  if (!editor.state.notice && !editor.storageError) return null;
  const text =
    editor.storageError ||
    (editor.trial
      ? editor.state.dirty
        ? "Perubahan belum tersimpan di browser."
        : "Draf tersimpan di browser ini."
      : editor.remote
        ? editor.persisting
          ? "Menyimpan draf pada akun..."
          : "Draf tersimpan pada akun."
        : editor.state.notice);
  if (text === "Draf tersimpan di browser ini." || text === "Draf tersimpan pada akun.")
    return null;
  return (
    <div
      role="status"
      className="border-b border-ux-border bg-warning-bg px-5 py-3 text-xs text-warning"
    >
      {text}
    </div>
  );
}
