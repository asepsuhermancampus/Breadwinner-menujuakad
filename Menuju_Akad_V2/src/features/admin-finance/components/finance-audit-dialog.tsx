"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { appendFinanceCorrection } from "../domain/finance-audit";
import type {
  FinanceAudit,
  FinanceContext,
  FinanceResult,
  FinanceState,
} from "../types/admin-finance";
import { FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

export function FinanceAuditDetailDialog({
  detail,
  state,
  context,
  onResult,
  onClose,
}: {
  detail: FinanceAudit | null;
  state: FinanceState;
  context: FinanceContext;
  onResult: (result: FinanceResult) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleClose() {
    setReason("");
    setError("");
    onClose();
  }

  function handleCorrect() {
    if (!detail) return;
    const result = appendFinanceCorrection(state, detail.id, reason, context);
    onResult(result);
    if (result.ok) {
      handleClose();
    } else {
      setError(result.message);
    }
  }

  return (
    <Dialog
      open={Boolean(detail)}
      title={`${detail?.id ?? ""} · detail audit`}
      onClose={handleClose}
    >
      {detail && (
        <div className={styles.stack}>
          <FinanceTable
            label="Detail audit lokal"
            headers={["Catatan", "Nilai"]}
            rows={[
              ["Objek / versi", `${detail.objectId} · ${detail.beforeVersion} → ${detail.version}`],
              ["Aktor", detail.actor],
              ["Alasan", detail.reason],
              ["Perubahan", detail.diff ?? detail.result],
              ["Event terkait", detail.linkedId ?? "Tidak ada"],
            ]}
          />
          <Field
            label="Alasan koreksi tertaut"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setError("");
            }}
          />
          {error && (
            <p role="alert" className={styles.status}>
              {error}
            </p>
          )}
          <Button disabled={!context.permissions.settings} onClick={handleCorrect}>
            Tambahkan koreksi baru
          </Button>
          <FinanceNote>
            Event asli dipertahankan. Tidak ada tombol menghapus atau mengubah histori.
          </FinanceNote>
        </div>
      )}
    </Dialog>
  );
}
