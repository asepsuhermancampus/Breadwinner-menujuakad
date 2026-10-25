import { CatalogRequests } from "@/features/marketplace/components/catalog-requests";
import { notFound } from "next/navigation";
import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { AccountCatalog, TrialCatalog } from "@/features/marketplace/components/catalog-adapters";
import { dashboardContext } from "./dashboard-context";
export async function CustomerCatalogPage({
  favorites = false,
  vendorId,
}: {
  favorites?: boolean;
  vendorId?: string | undefined;
}) {
  const access = await dashboardContext(),
    session = access.mode === "account" ? await auth() : null;
  const all = new MarketplaceCatalog(getWorkspaceService().db).list(),
    vendors = vendorId ? all.filter((v) => v.id === vendorId) : all;
  if (vendorId && vendors.length === 0) notFound();
  const props = { vendors, favorites, operator: isOperator(session) };
  return (
    <CustomerShell access={access}>
      {access.mode === "guest" ? (
        <TrialCatalog {...props} />
      ) : (
        <AccountCatalog {...props} workspaceId={access.workspace.id} />
      )}
      {props.operator && (
        <CatalogRequests orders={new MarketplaceCatalog(getWorkspaceService().db).requests()} />
      )}
    </CustomerShell>
  );
}
