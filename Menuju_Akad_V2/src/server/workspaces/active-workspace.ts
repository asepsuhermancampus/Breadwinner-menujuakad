import "server-only";
import { cookies } from "next/headers";
import { getWorkspaceService } from "./runtime";
import { PaymentError } from "@/server/payments/errors";
export async function activeWorkspace(account: string) {
  const id = (await cookies()).get("ma-workspace")?.value,
    service = getWorkspaceService();
  try {
    return service.requireWorkspace(account, id);
  } catch (error) {
    if (error instanceof PaymentError && error.httpStatus === 404)
      return service.getOrCreateWorkspace(account);
    throw error;
  }
}
