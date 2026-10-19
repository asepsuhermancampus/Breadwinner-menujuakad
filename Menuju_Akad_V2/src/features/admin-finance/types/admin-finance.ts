export type AdminFinanceView =
  "reconciliation" | "webhook" | "payouts" | "dispute" | "refund" | "settings" | "audit";
export type FinanceRole = "superadmin" | "finance" | "support";
export type FinancePermission = "reconcile" | "payout" | "refund" | "settings" | "export";
export type FinanceContext = {
  role: FinanceRole;
  actorId: string;
  online: boolean;
  sessionValid: boolean;
  permissions: Record<FinancePermission, boolean>;
  now: () => number;
};
export type ReconciliationRow = {
  id: string;
  paymentId: string;
  amount: number;
  internal: "paid" | "waiting" | "expired";
  provider: "settled" | "expired";
  version: number;
};
export type PayoutRow = {
  id: string;
  vendor: string;
  amount: number;
  holdAmount: number;
  bankLast4: string;
  bankVerified: boolean;
  disputed: boolean;
  serviceComplete: boolean;
  version: number;
  status: "accepted" | "scheduled";
  scheduledFor: string | null;
};
export type FinanceAudit = {
  id: string;
  at: string;
  actor: string;
  objectId: string;
  action: string;
  result: string;
  reason: string;
  beforeVersion: number;
  version: number;
  linkedId?: string;
  diff?: string;
};
export type FinanceConfig = {
  version: number;
  feeBps: number;
  bankName: string;
  bankLast4: string;
  manualQris: false;
};
export type FinanceState = {
  reconciliations: ReconciliationRow[];
  payouts: PayoutRow[];
  dispute: { id: string; orderId: string; paymentId: string; active: boolean; version: number };
  payment: {
    id: string;
    captured: number;
    refunded: number;
    reservedRefund: number;
    version: number;
    status: "captured" | "refund-pending" | "refund-unknown";
  };
  config: FinanceConfig;
  otp: {
    actorId: string;
    scope: "financial_settings.write";
    verifiedUntil: number;
    challengeExpiresAt: number;
    resendAfter: number;
  } | null;
  operations: Record<string, { fingerprint: string; result: string }>;
  audit: FinanceAudit[];
};
export type FinanceResult = {
  ok: boolean;
  state: FinanceState;
  message: string;
  errors?: Record<string, string>;
};
export type FinanceIntent = {
  operationId: string;
  expectedVersion: number;
  reason: string;
  acknowledged: boolean;
};
export type ReconcileInput = FinanceIntent & {
  transactionId: string;
  eventId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  signatureValid: boolean;
  key: string;
};
export type RefundInput = FinanceIntent & {
  amount: number;
  paymentId: string;
  disputeId: string;
  expectedDisputeVersion: number;
  originalMethod: boolean;
  response: "accepted" | "unknown" | "failed";
};
export type ConfigInput = FinanceIntent & {
  feeBps: number;
  bankName: string;
  bankLast4: string;
  bankValidated: boolean;
};
export type FinanceScreenProps = {
  state: FinanceState;
  context: FinanceContext;
  onResult: (result: FinanceResult) => void;
};
