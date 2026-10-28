"use client";
import { Dialog } from "@/components/ui/dialog";
import { DocumentEditForm } from "@/features/customer-workspace/components/document-edit-form";
import type { DocumentItem } from "../domain/document-template";
export function DocumentChecklistDialogs({
  editing,
  closeEdit,
  saveEdit,
}: {
  editing: DocumentItem | null;
  closeEdit: () => void;
  saveEdit: (item: DocumentItem) => Promise<boolean>;
}) {
  return (
    <Dialog open={Boolean(editing)} onClose={closeEdit} title="Edit berkas tambahan">
      {editing && (
        <DocumentEditForm key={editing.id} item={editing} cancel={closeEdit} save={saveEdit} />
      )}
    </Dialog>
  );
}
