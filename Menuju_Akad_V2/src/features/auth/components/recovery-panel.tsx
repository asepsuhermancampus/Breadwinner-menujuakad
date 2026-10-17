"use client";

import Link from "next/link";
import { Status } from "@/components/ui/status";
import type { useAuthFlow } from "../hooks/use-auth-flow";
import type { AuthAdapter } from "../types/auth-contracts";
import { CredentialResetForm } from "./credential-reset-form";
import { RecoveryRequestForm } from "./recovery-request-form";
import styles from "./auth-form.module.css";

type Props = { flow: ReturnType<typeof useAuthFlow>; adapter: AuthAdapter };

function RecoveryContent({ flow, adapter }: Props) {
  if (flow.saved)
    return (
      <div className={styles.form}>
        <Status tone="success">
          {adapter.mode === "mock"
            ? "Simulasi perubahan akses selesai. Akun produksi tidak berubah."
            : "Akses diperbarui. Silakan masuk kembali."}
        </Status>
        <Link className={styles.back} href="/preview-ui/auth/login">
          Kembali masuk
        </Link>
      </div>
    );
  if (flow.grant)
    return (
      <CredentialResetForm
        kind={flow.recoveryMethod === "email" ? "password" : "pin"}
        destination={flow.grant.destination}
        pending={flow.pending}
        onSubmit={(secret) => void flow.reset(secret)}
      />
    );
  return (
    <RecoveryRequestForm
      pending={flow.pending}
      onSubmit={(input) => {
        flow.setRecoveryMethod(input.method);
        void flow.begin(() => adapter.recover(input));
      }}
    />
  );
}

export function RecoveryPanel({ flow, adapter }: Props) {
  let title = "Pulihkan akses kalian";
  if (flow.grant)
    title = flow.recoveryMethod === "email" ? "Buat kata sandi baru" : "Buat PIN baru";
  if (flow.saved) title = "Akses diperbarui";
  return (
    <>
      <Link className={styles.back} href="/preview-ui/auth/login">
        ← Kembali ke halaman masuk
      </Link>
      <div className={styles.intro}>
        <h1>{title}</h1>
        <p>Pilih akses yang aman untuk ruang kalian.</p>
      </div>
      <RecoveryContent flow={flow} adapter={adapter} />
    </>
  );
}
