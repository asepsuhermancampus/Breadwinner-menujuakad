import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { ResourceKind } from "./resource-policy";
import type { CustomerWorkspace } from "@/features/customer-workspace/types";
import { isAvailabilityFeature } from "@/features/customer-workspace/domain/feature-availability-catalog";
import { readFeatureAvailability } from "./feature-availability";
import { PaymentError } from "@/server/payments/errors";

export function assertResourceAvailable(
  db: DatabaseSync,
  kind: ResourceKind,
  workspace: CustomerWorkspace,
) {
  const feature =
    kind === "catering-settings" ? "catering" : kind === "vendor-favorites" ? "vendors" : kind;
  if (
    isAvailabilityFeature(feature) &&
    !readFeatureAvailability(db, feature, workspace.role, workspace).available
  )
    throw new PaymentError("Fitur belum tersedia untuk akun ini.", 403);
}
