"use client";
import type { CustomerWorkspace } from "../types";
import { LandingPlanCard } from "@/features/landing/components/landing-plan-card";
import { PlanPurchaseProvider } from "@/features/payments/components/plan-purchase-provider";
import styles from "@/features/plans/components/plans.module.css";
import visuals from "./customer-settings.module.css";
export function CustomerPlans({
  workspace,
  guest = false,
}: {
  workspace: CustomerWorkspace;
  guest?: boolean;
}) {
  const { planId, expiresAt } = workspace.subscription;
  return (
    <PlanPurchaseProvider>
      <div className={styles.notice}>
        <div>
          <p className="text-sm font-medium">
            {guest ? "Mode percobaan · " : ""}Paket{" "}
            {planId === "lifetime" ? "Lifetime" : planId === "premium" ? "Premium" : "Free"} aktif
            {expiresAt
              ? ` hingga ${new Date(expiresAt).toLocaleDateString("id-ID", { dateStyle: "long" })}`
              : " tanpa kedaluwarsa"}
          </p>
          <p className={`${styles.copy} mt-1`}>Rencana dan kenangan tetap milik kalian.</p>
        </div>
      </div>
      <div className={`${styles.grid} ${visuals.plans} mt-5`}>
        {(["free", "premium", "lifetime"] as const).map((id) => (
          <LandingPlanCard key={id} id={id} />
        ))}
      </div>
      <p className={styles.finePrint}>
        Pembayaran aman · Tanpa perpanjangan otomatis · Data tetap tersimpan.
        <br />
        Ketersediaan fitur mengikuti rilis layanan.
      </p>
    </PlanPurchaseProvider>
  );
}
