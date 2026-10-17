import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import styles from "./account.module.css";

export function DirtyDismiss({
  open,
  pending,
  onContinue,
  onDiscard,
  onSave,
}: {
  open: boolean;
  pending: boolean;
  onContinue: () => void;
  onDiscard: () => void;
  onSave: () => void;
}) {
  return (
    <Dialog open={open} onClose={onContinue} title="Simpan perubahanmu?">
      <p className={styles.description}>
        Ada draf yang belum disimpan. Kamu bisa melanjutkan edit, menyimpan, atau membuang perubahan
        ini.
      </p>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onContinue} disabled={pending}>
          Lanjut edit
        </Button>
        <Button variant="secondary" onClick={onDiscard} disabled={pending}>
          Buang perubahan
        </Button>
        <Button onClick={onSave} disabled={pending}>
          {pending ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </Dialog>
  );
}
