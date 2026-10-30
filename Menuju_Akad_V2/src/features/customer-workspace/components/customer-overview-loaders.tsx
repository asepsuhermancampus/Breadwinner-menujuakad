"use client";
import { useAccountOverview, useGuestOverview } from "../hooks/use-overview-resources";
import { CustomerOverview, type OverviewProps } from "./customer-overview";
export function AccountOverview(props: OverviewProps) {
  const resources = useAccountOverview(
    props.workspace.id,
    props.tasksAvailable,
    props.calendarAvailable,
    props.documentsAvailable,
    props.guestsAvailable,
    props.financeAvailable,
  );
  return <CustomerOverview {...props} resources={resources} />;
}
export function GuestOverview(props: OverviewProps) {
  const resources = useGuestOverview(
    props.tasksAvailable,
    props.calendarAvailable,
    props.documentsAvailable,
    props.guestsAvailable,
    props.financeAvailable,
  );
  return <CustomerOverview {...props} resources={resources} guest />;
}
