import { TrialExport } from "@/features/dashboard-trial/components/trial-export";
import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { PlanExport } from "@/features/customer-workspace/components/plan-export";
import { PageHeading } from "@/components/ui/page-heading";

export const dynamic = "force-dynamic";

export default async function WeddingKitPage() {
  const context = await dashboardContext();
  return (
    <CustomerShell access={context}>
      <div className="space-y-6">
        <PageHeading
          title="Wedding Kit"
          description="Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak."
        />
        {context.mode === "guest" ? (
          <TrialExport showHeading={false} />
        ) : context.workspace.subscription.capabilities.includes("pdf") ? (
          <PlanExport showHeading={false} />
        ) : (
          <FeatureLock title="Ekspor PDF">
            <PlanExport showHeading={false} />
          </FeatureLock>
        )}
      </div>
    </CustomerShell>
  );
}
