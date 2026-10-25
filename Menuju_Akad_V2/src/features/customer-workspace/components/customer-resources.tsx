"use client";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { ResourceEditor } from "./resource-editor";
type Kind = "guests" | "tasks" | "moodboard" | "documents" | "finance";
export function CustomerResources({ kind, workspaceId }: { kind: Kind; workspaceId: string }) {
  const state = useCustomerResource(kind, workspaceId);
  return <ResourceEditor kind={kind} state={state} />;
}
export function TrialResources({ kind }: { kind: Kind }) {
  const state = useTrialResource(kind);
  return <ResourceEditor kind={kind} state={state} trial />;
}
