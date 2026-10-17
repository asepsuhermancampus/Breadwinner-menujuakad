export type PlanId = "free" | "premium" | "lifetime";

export type PlanEntitlement = {
  plan: PlanId;
  expiresAt: string | null;
};

export type PlanInvoice = {
  id: string;
  label: string;
  date: string;
  amountIdr: number;
  status: "paid" | "pending" | "expired";
};

export type PlanChangeResult =
  | { ok: true; data: { message: string } }
  | {
      ok: false;
      code: "invalid" | "offline" | "revoked" | "conflict" | "unavailable";
      message: string;
    };

export interface PlanAdapter {
  requestPlanChange(input: { plan: "premium" | "lifetime" }): Promise<PlanChangeResult>;
}
