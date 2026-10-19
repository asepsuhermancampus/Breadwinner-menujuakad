export type Commission = {
  id: string;
  sourceId: string;
  date: string;
  label: string;
  program: "historical" | "couple" | "vendor";
  amountIdr: number;
  eligibleFeeIdr: number;
  status: "available" | "pending" | "held";
  version: number;
};
export type AmbassadorWithdrawal = {
  id: string;
  operationId: string;
  amountIdr: number;
  bankLast4: string;
  status: "unknown" | "accepted" | "scheduled" | "completed";
};
export type AmbassadorState = {
  ownerId: string;
  version: number;
  bank: { name: string; last4: string; verified: boolean };
  commissions: Commission[];
  withdrawals: AmbassadorWithdrawal[];
  audit: { id: string; actorId: string; action: string; reference: string; version: number }[];
};
export type AmbassadorContext = {
  role: "ambassador" | "support" | "finance";
  actorId: string;
  ownerId: string;
  sessionValid: boolean;
  online: boolean;
  sandbox: boolean;
  availability: "hidden" | "live";
  permissions: {
    withdraw: boolean;
    referralCopy: boolean;
    export: boolean;
    attributionWrite: boolean;
  };
  latestVersion: number;
  disputed: boolean;
};
export type AmbassadorResult = {
  ok: boolean;
  state: AmbassadorState;
  message: string;
  errors?: Record<string, string>;
};
export type WithdrawalInput = {
  amountIdr: number;
  bankLast4: string;
  expectedVersion: number;
  operationId: string;
  acknowledged: boolean;
  outcome: "success" | "failure" | "unknown";
};
