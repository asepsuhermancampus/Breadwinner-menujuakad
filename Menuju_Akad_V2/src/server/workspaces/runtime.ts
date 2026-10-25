import "server-only";
import { getPaymentDatabase } from "@/server/payments/runtime";
import { WorkspaceService } from "./service";
export function getWorkspaceService() {
  return new WorkspaceService(getPaymentDatabase().storage());
}
