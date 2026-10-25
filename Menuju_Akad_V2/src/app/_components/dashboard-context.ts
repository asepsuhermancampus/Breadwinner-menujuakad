import "server-only";
import { customerContext } from "./customer-context";
import {
  guestDashboardAccess,
  type DashboardAccess,
} from "@/features/customer-workspace/domain/dashboard-access";
export async function dashboardContext(): Promise<DashboardAccess> {
  const context = await customerContext();
  return context
    ? { mode: "account", workspace: context.workspace, identity: context.user.email! }
    : guestDashboardAccess();
}
