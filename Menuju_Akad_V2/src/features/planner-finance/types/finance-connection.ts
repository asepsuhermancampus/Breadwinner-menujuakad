import type { FinanceCommand, FinanceSnapshot } from "./finance-ledger";

export type FinanceConnection = {
  snapshot: FinanceSnapshot;
  pending: boolean;
  error: string;
  command: (action: FinanceCommand) => Promise<boolean>;
  trial: boolean;
  consumeExport?: () => Promise<boolean>;
};
