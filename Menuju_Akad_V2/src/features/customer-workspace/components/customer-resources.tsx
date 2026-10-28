"use client";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { ResourceEditor } from "./resource-editor";
import {
  AccountFinanceWorkspace,
  TrialFinanceWorkspace,
} from "@/features/planner-finance/components/customer-finance-workspace";
type Kind = "guests" | "tasks" | "moodboard" | "documents" | "finance";
export function CustomerResources({ kind, workspaceId }: { kind: Kind; workspaceId: string }) {
  if (kind === "finance")
    return <AccountFinanceWorkspace key={workspaceId} workspaceId={workspaceId} />;
  return <AccountResource kind={kind} workspaceId={workspaceId} />;
}
function AccountResource({ kind, workspaceId }: { kind: Kind; workspaceId: string }) {
  const state = useCustomerResource(kind, workspaceId);
  return <ResourceEditor kind={kind} state={state} />;
}
export function TrialResources({ kind }: { kind: Kind }) {
  if (kind === "finance") return <TrialFinanceWorkspace />;
  return <TrialResource kind={kind} />;
}
function TrialResource({ kind }: { kind: Kind }) {
  const state = useTrialResource(kind);
  return <ResourceEditor kind={kind} state={state} trial />;
}
