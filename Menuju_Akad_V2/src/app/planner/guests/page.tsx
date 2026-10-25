import { CustomerResourcePage } from "@/app/_components/customer-resource-page";

export const dynamic = "force-dynamic";

export default function PlannerGuestsPage() {
  return <CustomerResourcePage kind="guests" />;
}
