"use client";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { useCustomerResource } from "@/features/customer-workspace/hooks/use-customer-resource";
import type { CatalogVendor } from "../types/customer-catalog";
import { Catalog } from "./customer-catalog";
export function AccountCatalog({
  workspaceId,
  ...props
}: {
  workspaceId: string;
  vendors: CatalogVendor[];
  operator: boolean;
  favorites: boolean;
}) {
  const state = useCustomerResource("vendor-favorites", workspaceId);
  return <Catalog {...props} state={state} guest={false} />;
}
export function TrialCatalog(props: {
  vendors: CatalogVendor[];
  operator: boolean;
  favorites: boolean;
}) {
  const state = useTrialResource("vendor-favorites");
  return <Catalog {...props} state={state} guest />;
}
