import { notFound } from "next/navigation";
import { PreviewFulfillment } from "@/preview/components/preview-fulfillment";

export const dynamic = "force-dynamic";

export default async function FulfillmentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  if (!orderId || !/^[A-Za-z0-9_-]+$/.test(orderId)) notFound();
  return <PreviewFulfillment orderId={orderId} />;
}
