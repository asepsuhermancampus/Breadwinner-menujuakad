import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { MoodboardScreen } from "@/features/moodboards/components/moodboard-screen";
import { dashboardContext } from "./dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import {
  CustomerResources,
  TrialResources,
} from "@/features/customer-workspace/components/customer-resources";
export async function CustomerResourcePage({
  kind,
}: {
  kind: "guests" | "tasks" | "moodboard" | "documents" | "finance";
}) {
  const access = await dashboardContext();
  const locked =
    access.mode === "account" &&
    kind === "moodboard" &&
    !access.workspace.subscription.capabilities.includes("moodboard");
  return (
    <CustomerShell access={access}>
      {locked ? (
        <FeatureLock title="Moodboard">
          <MoodboardScreen initialItems={[]} palette={[]} />
        </FeatureLock>
      ) : access.mode === "guest" ? (
        <TrialResources kind={kind} />
      ) : (
        <CustomerResources kind={kind} workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}
