"use client";
import { useCustomerResource } from "./use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { useFeatureAvailability } from "../components/feature-availability-context";
import { isHiddenBudget } from "@/features/planner-finance/domain/expense-visibility";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
export function useAccountOverview(
  id: string,
  tasksAvailable = true,
  calendarAvailable = true,
  documentsAvailable = true,
  guestsAvailable = true,
  financeAvailable = true,
) {
  const availability = useFeatureAvailability();
  const restricted = [
    ...(availability?.seserahan === true ? [] : ["seserahan" as const]),
    ...(availability?.catering === true ? [] : ["catering" as const]),
  ];
  const taskResource = useCustomerResource("tasks", id, tasksAvailable, true);
  const tasks = tasksAvailable ? taskResource : { ...taskResource, data: [], error: "" };
  const documentResource = useCustomerResource("documents", id, documentsAvailable, true);
  const documents = documentsAvailable
    ? documentResource
    : { ...documentResource, data: [], error: "" };
  const financeResource = useCustomerResource("finance", id, financeAvailable, true);
  const finance = financeAvailable
    ? {
        ...financeResource,
        data:
          financeResource.data?.filter(
            (row) => !isHiddenBudget(row as CustomerBudget, restricted),
          ) ?? null,
      }
    : { ...financeResource, data: [], error: "" };
  const guestResource = useCustomerResource("guests", id, guestsAvailable, true);
  const guests = guestsAvailable ? guestResource : { ...guestResource, data: [], error: "" };
  const calendarResource = useCustomerResource("calendar", id, calendarAvailable, true);
  const calendar = calendarAvailable
    ? calendarResource
    : { ...calendarResource, data: [], error: "" };
  return { tasks, documents, finance, guests, calendar };
}
export function useGuestOverview(
  tasksAvailable = true,
  calendarAvailable = true,
  documentsAvailable = true,
  guestsAvailable = true,
  financeAvailable = true,
) {
  const availability = useFeatureAvailability();
  const restricted = [
    ...(availability?.seserahan === true ? [] : ["seserahan" as const]),
    ...(availability?.catering === true ? [] : ["catering" as const]),
  ];
  const trialTasks = useTrialResource("tasks");
  const tasks = tasksAvailable ? trialTasks : { ...trialTasks, data: [], error: "" };
  const trialDocuments = useTrialResource("documents");
  const documents = documentsAvailable
    ? trialDocuments
    : { ...trialDocuments, data: [], error: "" };
  const trialFinance = useTrialResource("finance");
  const finance = financeAvailable
    ? {
        ...trialFinance,
        data:
          trialFinance.data?.filter((row) => !isHiddenBudget(row as CustomerBudget, restricted)) ??
          null,
      }
    : { ...trialFinance, data: [], error: "" };
  const trialGuests = useTrialResource("guests");
  const guests = guestsAvailable ? trialGuests : { ...trialGuests, data: [], error: "" };
  const trialCalendar = useTrialResource("calendar");
  const calendar = calendarAvailable ? trialCalendar : { ...trialCalendar, data: [], error: "" };
  return { tasks, documents, finance, guests, calendar };
}
export type OverviewResources = ReturnType<typeof useAccountOverview>;
