import type { CustomerWorkspace } from "../types";
import { AccountOverview, GuestOverview } from "./customer-overview";
import { CustomerFeatureLinks } from "./customer-feature-links";
export function CustomerDashboard({
  workspace,
  guest = false,
}: {
  workspace: CustomerWorkspace;
  guest?: boolean;
}) {
  return (
    <>
      {guest ? <GuestOverview workspace={workspace} /> : <AccountOverview workspace={workspace} />}
      <CustomerFeatureLinks />
    </>
  );
}
