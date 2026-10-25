import { CustomerCatalogPage } from "@/app/_components/customer-catalog-page";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ vendorId: string }> }) {
  const { vendorId } = await params;
  return <CustomerCatalogPage vendorId={vendorId} />;
}
