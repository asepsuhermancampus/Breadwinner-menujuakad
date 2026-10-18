"use client";
import { FulfillmentScreen } from "@/features/digital-products/components/fulfillment-screen";
import { PreviewNotice } from "./preview-notice";
import { digitalOrderFixture } from "../fixtures/planner-products";

type Props = {
  orderId: string;
};

export function PreviewFulfillment({ orderId }: Props) {
  const order = { ...digitalOrderFixture, orderId };
  return (
    <>
      <PreviewNotice />
      <FulfillmentScreen initialOrder={order} />
    </>
  );
}
