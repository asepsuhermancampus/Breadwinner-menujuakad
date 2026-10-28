"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useTrial } from "@/features/dashboard-trial/components/trial-provider";
import { useAccountFinance } from "../hooks/use-account-finance";
import { emptyFinanceBook, financeSnapshot } from "../domain/finance-ledger";
import type { FinanceBook, FinanceCommand } from "../types/finance-ledger";
import type { CustomerBudget } from "../types/customer-budget";
import { CustomerFinance } from "./customer-finance";

import type { FinanceConnection } from "../types/finance-connection";

export function AccountFinanceWorkspace({ workspaceId }: { workspaceId: string }) {
  const connection = useAccountFinance(workspaceId);
  const router = useRouter();
  if (!connection.snapshot)
    return connection.error ? (
      <div role="alert" className="space-y-3 text-sm text-danger">
        <p>{connection.error}</p>
        <Button variant="secondary" onClick={() => void connection.refresh()}>
          Coba lagi
        </Button>
      </div>
    ) : (
      <PageSkeleton variant="cards" label="Memuat tabungan dan anggaran" />
    );
  return (
    <CustomerFinance
      initial={connection.snapshot.budgets}
      onChange={(budgets) => connection.command({ type: "save-budgets", budgets })}
      finance={{
        ...connection,
        snapshot: connection.snapshot,
        trial: false,
        command: async (action) => {
          const ok = await connection.command(action);
          if (ok && action.type === "claim") router.refresh();
          return ok;
        },
      }}
    />
  );
}

export function TrialFinanceWorkspace() {
  const trial = useTrial();
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  if (!trial?.snapshot)
    return trial?.error ? (
      <p role="alert" className="text-sm text-danger">
        {trial.error}
      </p>
    ) : (
      <PageSkeleton variant="cards" label="Memuat tabungan dan anggaran" />
    );
  const book =
    (trial.snapshot.resources.savings?.[0] as FinanceBook | undefined) ?? emptyFinanceBook();
  const snapshot = financeSnapshot(
    book,
    (trial.snapshot.resources.finance ?? []) as CustomerBudget[],
    "trial-customer",
  );
  const command = async (action: FinanceCommand) => {
    if (busy.current) return false;
    busy.current = true;
    setPending(true);
    try {
      return await trial.finance({
        revision: snapshot.revision,
        requestId: crypto.randomUUID(),
        command: action,
      });
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  const finance: FinanceConnection = {
    snapshot,
    pending,
    error: trial.error,
    command,
    trial: true,
    consumeExport: trial.consumeExport,
  };
  return (
    <CustomerFinance
      initial={snapshot.budgets}
      onChange={(budgets) => command({ type: "save-budgets", budgets })}
      finance={finance}
    />
  );
}
