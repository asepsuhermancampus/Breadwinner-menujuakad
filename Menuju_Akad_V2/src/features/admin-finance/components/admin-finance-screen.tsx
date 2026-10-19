"use client";
import type { AdminFinanceView, FinanceRole } from "../types/admin-finance";
import { useAdminFinance } from "../hooks/use-admin-finance";
import { FinanceReconciliation } from "./finance-reconciliation";
import { FinancePayouts } from "./finance-payouts";
import { FinanceDispute } from "./finance-dispute";
import { FinanceSettings } from "./finance-settings";
import { FinanceAuditView } from "./finance-audit";
import { FinanceCheck } from "./finance-parts";
import styles from "./finance.module.css";

export function AdminFinanceScreen({ view, role }: { view: AdminFinanceView; role: FinanceRole }) {
  const finance = useAdminFinance(role);
  const props = { state: finance.state, context: finance.context, onResult: finance.onResult };
  return (
    <div className={styles.screen}>
      {finance.notice && (
        <p role="status" aria-live="polite" className={styles.status}>
          {finance.notice}
        </p>
      )}
      {(view === "reconciliation" || view === "webhook") && (
        <FinanceReconciliation key={view} {...props} inspect={view === "webhook"} />
      )}
      {view === "payouts" && <FinancePayouts {...props} />}
      {(view === "dispute" || view === "refund") && (
        <FinanceDispute key={view} {...props} review={view === "refund"} />
      )}
      {view === "settings" && <FinanceSettings {...props} />}
      {view === "audit" && <FinanceAuditView {...props} />}
      <details className={styles.simulator}>
        <summary>Simulasi ketahanan sesi lokal</summary>
        <p className="mt-3 text-secondary">
          Sandbox internal · mock lokal tanpa koneksi bank, gateway, OTP, atau transaksi nyata.
          Cakupan akun: {role}.
        </p>
        <div className={styles.controls}>
          <FinanceCheck
            checked={!finance.online}
            onChange={(checked) => finance.setOnline(!checked)}
          >
            Offline
          </FinanceCheck>
          <FinanceCheck checked={finance.revoked} onChange={finance.setRevoked}>
            Izin tindakan dicabut
          </FinanceCheck>
          <FinanceCheck
            checked={!finance.sessionValid}
            onChange={(checked) => finance.setSessionValid(!checked)}
          >
            Sesi kedaluwarsa
          </FinanceCheck>
        </div>
        <p className="text-secondary">
          Setiap tindakan memeriksa ulang kondisi ini di domain. Otorisasi server menunggu backend.
        </p>
      </details>
    </div>
  );
}

export type { AdminFinanceView } from "../types/admin-finance";
