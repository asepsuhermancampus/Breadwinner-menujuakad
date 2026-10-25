import { dashboardContext } from "../_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { CustomerDashboard } from "@/features/customer-workspace/components/customer-dashboard";
export const dynamic = "force-dynamic";
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour } = await searchParams;
  const access = await dashboardContext();
  return (
    <CustomerShell access={access} autoStartGuide={tour === "features"}>
      <CustomerDashboard workspace={access.workspace} guest={access.mode === "guest"} />
    </CustomerShell>
  );
}
