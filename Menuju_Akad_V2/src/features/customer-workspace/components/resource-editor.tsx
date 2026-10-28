"use client";

import { TasksScreen } from "@/features/planner-tasks/components/tasks-screen";
import { GuestCrmScreen } from "@/features/guest-crm/components/guest-crm-screen";
import { MoodboardScreen } from "@/features/moodboards/components/moodboard-screen";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { MoodboardItem } from "@/features/moodboards/types/moodboard";
import { DocumentChecklistScreen } from "@/features/kua-documents/components/document-checklist-screen";
import type { DocumentItem } from "@/features/kua-documents/domain/document-template";
import { useCustomerEvent } from "./customer-event-context";
import { ResourceLoading } from "./resource-loading";
import {
  CustomerFinance,
  type CustomerBudget,
} from "@/features/planner-finance/components/customer-finance";

export function ResourceEditor({
  kind,
  state,
  trial = false,
}: {
  kind: "guests" | "tasks" | "moodboard" | "documents" | "finance";
  state: {
    data: unknown[] | null;
    error: string;
    saving: boolean;
    save: (value: unknown[]) => Promise<boolean>;
  };
  trial?: boolean;
}) {
  const event = useCustomerEvent();
  return (
    <>
      {state.saving && (
        <p role="status" className="sr-only">
          Menyimpan perubahan…
        </p>
      )}
      {!state.data && !state.error && <ResourceLoading kind={kind} />}
      {state.error && (
        <p role="alert" className="rounded-card border border-danger/30 p-3 text-sm text-danger">
          {state.error}{" "}
          <button onClick={() => location.reload()} className="underline">
            Muat ulang data
          </button>
        </p>
      )}
      {state.data && (
        <div
          id={`feature-${kind === "guests" ? "unlimited-guests" : kind === "tasks" ? "unlimited-tasks" : kind}`}
          tabIndex={-1}
        >
          {kind === "tasks" ? (
            <TasksScreen
              initialTasks={state.data as PlannerTask[]}
              onChange={state.save}
              event={event}
            />
          ) : kind === "guests" ? (
            <GuestCrmScreen
              initialGuests={state.data as GuestInvitation[]}
              onChange={state.save}
              customerLabel="Ruang kalian"
              trial={trial}
            />
          ) : kind === "moodboard" ? (
            <MoodboardScreen
              initialItems={state.data as MoodboardItem[]}
              palette={[]}
              onChange={state.save}
            />
          ) : kind === "finance" ? (
            <CustomerFinance initial={state.data as CustomerBudget[]} onChange={state.save} />
          ) : (
            <DocumentChecklistScreen initial={state.data as DocumentItem[]} onChange={state.save} />
          )}
        </div>
      )}
    </>
  );
}
