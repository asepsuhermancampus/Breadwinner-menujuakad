import { CustomerResourcePage } from "@/app/_components/customer-resource-page";

export const dynamic = "force-dynamic";

export default function FinancePage() {
  return <CustomerResourcePage kind="finance" />;
}
