import { CustomerCatalogPage } from "@/app/_components/customer-catalog-page";
export const dynamic = "force-dynamic";
export default function Page() {
  return <CustomerCatalogPage favorites={true} />;
}
