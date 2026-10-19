"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestFinanceOtp } from "../domain/finance-settings";
import type { FinanceScreenProps } from "../types/admin-finance";
import { FinanceCard, FinanceHeader, FinanceNote, FinanceTable } from "./finance-parts";
import { FinanceOtp } from "./finance-otp";
import { FinanceConfigReview } from "./finance-config-review";
import { FinanceAuditView } from "./finance-audit";
import styles from "./finance.module.css";

export function FinanceSettings(props: FinanceScreenProps) {
  const [stage, setStage] = useState<"locked" | "otp" | "review">("locked");
  const [audit, setAudit] = useState(false);
  const config = props.state.config;
  function begin() {
    const existing = props.state.otp;
    if (
      existing?.actorId === props.context.actorId &&
      Math.max(existing.verifiedUntil, existing.challengeExpiresAt) > props.context.now()
    ) {
      setStage(existing.verifiedUntil > props.context.now() ? "review" : "otp");
      return;
    }
    const result = requestFinanceOtp(props.state, props.context);
    props.onResult(result);
    if (result.ok) setStage("otp");
  }
  return (
    <>
      <FinanceHeader
        title="Keuangan sensitif, akses berlapis."
        detail={`Konfigurasi aktif v${config.version} · nilai sensitif disamarkan · baca sebelum otorisasi.`}
        action={
          <Button onClick={begin} disabled={!props.context.permissions.settings}>
            Verifikasi untuk perubahan
          </Button>
        }
      />
      <FinanceCard flat title={`Konfigurasi aktif · v${config.version}`}>
        <FinanceTable
          label="Konfigurasi keuangan terkunci"
          headers={["Pengaturan", "Nilai aktif", "Akses"]}
          rows={[
            ["Platform fee", `${config.feeBps / 100}% · untuk order baru`, "Terkunci"],
            [
              "Rekening penerimaan platform",
              `${config.bankName} ••${config.bankLast4}`,
              "Terkunci",
            ],
            ["KlikQRIS sandbox", "Secret •••••••••••• · tidak tersedia di client", "Terkunci"],
            ["QRIS manual", "Tidak aktif", "Terkunci"],
          ]}
        />
        <div className="mt-5">
          <FinanceNote>
            Rekening penerimaan platform berbeda dari rekening payout vendor. Kalyana tetap memakai
            rekening terverifikasi BCA ••1188. Bank usulan vendor tidak terpengaruh perubahan ini.
          </FinanceNote>
        </div>
      </FinanceCard>
      <FinanceCard flat title="Izin → OTP → review perbedaan → konfirmasi eksplisit">
        <div className={styles.stack}>
          <p>
            OTP hanya untuk scope bank dan fee pada sesi ini. Fee baru berlaku untuk order baru,
            sementara snapshot fee historis tetap. Validasi rekening usulan dan versi aktif
            diperiksa kembali saat konfirmasi.
          </p>
          <FinanceNote>
            Simulasi lokal: tidak ada OTP dikirim, rekening diubah di bank, atau gateway dihubungi.
            Nilai OTP dan kredensial tidak dicatat dalam audit.
          </FinanceNote>
          {!props.context.permissions.settings && (
            <p className="text-sm text-secondary">
              Cakupan akun ini dapat membaca konfigurasi. Izin financial_settings.write diperlukan
              untuk mengubahnya.
            </p>
          )}
          <div>
            <Button variant="secondary" onClick={() => setAudit(!audit)}>
              {audit ? "Tutup audit konfigurasi" : "Buka audit konfigurasi"}
            </Button>
          </div>
        </div>
      </FinanceCard>
      {audit && <FinanceAuditView {...props} compact />}
      {stage === "otp" && (
        <FinanceOtp
          {...props}
          onClose={() => setStage("locked")}
          onVerified={() => setStage("review")}
        />
      )}
      {stage === "review" && <FinanceConfigReview {...props} onClose={() => setStage("locked")} />}
    </>
  );
}
