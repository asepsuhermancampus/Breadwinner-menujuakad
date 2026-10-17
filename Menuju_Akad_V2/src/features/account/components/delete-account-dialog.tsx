"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Status } from "@/components/ui/status";
import { useAccountOperation } from "../hooks/use-account-operation";
import { deletionSchema } from "../schemas/profile";
import type { AccountAdapter } from "../types/account";
import { OperationFeedback } from "./operation-feedback";
import styles from "./account.module.css";
import security from "./security.module.css";

export function DeleteAccountDialog({
  open,
  onClose,
  adapter,
  verificationHint,
}: {
  open: boolean;
  onClose: () => void;
  adapter: AccountAdapter;
  verificationHint?: string | undefined;
}) {
  const [step, setStep] = useState<"confirm" | "verify" | "done">("confirm");
  const [confirmation, setConfirmation] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const mutation = useAccountOperation();
  const canContinue = confirmation === "HAPUS AKUN" && acknowledged;
  const submitLabels = {
    confirm: "Lanjut ke verifikasi",
    verify: "Konfirmasi hapus akun simulasi",
    done: "Selesai",
  };
  const submitLabel = mutation.pending ? "Memverifikasi…" : submitLabels[step];

  function close() {
    if (mutation.pending) return;
    setStep("confirm");
    setConfirmation("");
    setAcknowledged(false);
    setCode("");
    setError("");
    onClose();
  }

  async function remove() {
    if (!/^\d{6}$/.test(code)) {
      setError("Masukkan enam digit kode verifikasi.");
      return;
    }
    setError("");
    const verified = await mutation.run(
      () => adapter.verifyDeletion({ code }),
      "Verifikasi diterima. Memeriksa ulang hak penghapusan…",
    );
    setCode("");
    if (!verified.ok) return;
    const parsed = deletionSchema.safeParse({
      proof: verified.data.proof,
      confirmation,
      acknowledged,
    });
    if (!parsed.success) {
      setError("Konfirmasi berubah. Periksa kembali dampak penghapusan.");
      setStep("confirm");
      return;
    }
    const deleted = await mutation.run(
      () => adapter.deleteAccount(parsed.data),
      "Simulasi penghapusan selesai. Tidak ada data produksi yang dihapus.",
    );
    if (deleted.ok && deleted.data.deleted) setStep("done");
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title={step === "verify" ? "Verifikasi penghapusan" : "Konfirmasi hapus akun"}
    >
      {step === "done" ? (
        <div className={styles.stack}>
          <Status tone="success">Simulasi penghapusan selesai. Akun produksi tidak berubah.</Status>
          <Button onClick={close}>Tutup pratinjau</Button>
        </div>
      ) : (
        <form
          className={styles.stack}
          onSubmit={(event) => {
            event.preventDefault();
            if (step === "verify") void remove();
            else if (canContinue) setStep("verify");
          }}
        >
          <p className="text-xs text-danger">Langkah {step === "confirm" ? "1" : "2"} dari 2</p>
          {step === "confirm" ? (
            <>
              <p className={styles.description}>
                Penghapusan akun bersifat permanen dan memutus aksesmu ke ruang bersama. Pastikan
                data penting sudah diunduh dan pasangan telah diberi tahu.
              </p>
              <ul className={security.consequences}>
                <li>Akses akun & sesi perangkat akan dinonaktifkan.</li>
                <li>Tautan kolaborasi dengan pasangan akan diputus.</li>
                <li>Tindakan ini tidak dapat dibatalkan.</li>
              </ul>
              <Field
                label="Ketik HAPUS AKUN untuk melanjutkan"
                value={confirmation}
                autoComplete="off"
                onChange={(event) => setConfirmation(event.target.value)}
              />
              <label className={security.acknowledgment}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                />
                Saya memahami dampak penghapusan akun ini.
              </label>
              <p className={styles.finePrint}>
                Kode verifikasi baru diperlukan sebelum konfirmasi akhir.
              </p>
            </>
          ) : (
            <>
              <Status tone="warning">
                Pratinjau penghapusan. Tidak ada OTP yang dikirim atau data produksi yang dihapus.
              </Status>
              <Field
                label="Kode verifikasi simulasi"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                maxLength={6}
                error={error}
                disabled={mutation.pending}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                hint={verificationHint ?? "Gunakan kode simulasi dari panel pratinjau."}
              />
              <p className={styles.finePrint}>
                Verifikasi berlaku singkat dan hanya untuk tindakan ini. Izin dan status akun
                diperiksa kembali saat konfirmasi.
              </p>
            </>
          )}
          <OperationFeedback feedback={mutation.feedback} />
          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={close} disabled={mutation.pending}>
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="danger"
              disabled={mutation.pending || (step === "confirm" && !canContinue)}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
