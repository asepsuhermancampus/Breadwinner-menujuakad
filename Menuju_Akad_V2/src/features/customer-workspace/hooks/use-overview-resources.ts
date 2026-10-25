"use client";
import { useCustomerResource } from "./use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
export function useAccountOverview(id: string) {
  const tasks = useCustomerResource("tasks", id);
  const documents = useCustomerResource("documents", id);
  const finance = useCustomerResource("finance", id);
  const guests = useCustomerResource("guests", id);
  const calendar = useCustomerResource("calendar", id);
  return { tasks, documents, finance, guests, calendar };
}
export function useGuestOverview() {
  const tasks = useTrialResource("tasks");
  const documents = useTrialResource("documents");
  const finance = useTrialResource("finance");
  const guests = useTrialResource("guests");
  const calendar = useTrialResource("calendar");
  return { tasks, documents, finance, guests, calendar };
}
export type OverviewResources = ReturnType<typeof useAccountOverview>;
