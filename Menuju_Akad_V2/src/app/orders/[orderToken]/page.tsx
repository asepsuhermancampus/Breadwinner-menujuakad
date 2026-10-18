import { PreviewOrderReceipt } from "@/preview/components/preview-checkout";

export const dynamic = "force-dynamic";

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ orderToken: string }>;
}) {
  const { orderToken } = await params;
  return <PreviewOrderReceipt orderToken={orderToken} />;
}
