import { TrialExport } from "@/features/dashboard-trial/components/trial-export";
import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { PlanExport } from "@/features/customer-workspace/components/plan-export";

export const dynamic = "force-dynamic";

export default async function WeddingKitPage() {
  const context = await dashboardContext();
  return (
    <CustomerShell access={context}>
      {context.mode === "guest" ? (
        <TrialExport />
      ) : context.workspace.subscription.capabilities.includes("pdf") ? (
        <PlanExport />
      ) : (
        <FeatureLock title="Ekspor PDF">
          <PlanExport />
        </FeatureLock>
      )}
    </CustomerShell>
  );
}
