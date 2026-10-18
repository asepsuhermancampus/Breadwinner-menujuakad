import { PreviewVendorDetail } from "@/preview/components/preview-marketplace";

export const dynamic = "force-dynamic";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  return <PreviewVendorDetail vendorSlug={vendorId} />;
}
