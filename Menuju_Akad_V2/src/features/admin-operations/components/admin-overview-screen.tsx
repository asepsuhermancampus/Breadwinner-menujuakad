"use client";
import { useState } from "react";
import { createAdminReviewState } from "../content/admin-content";
import type { AdminRole, OverviewView, ReviewContext } from "../types/admin";
import { AdminExecutive } from "./admin-executive";
import { AdminMasterCalendar } from "./admin-master-calendar";
import { AdminReviewBoard } from "./admin-review-board";
export function AdminOverviewScreen({
  view,
  role,
  onNavigate,
}: {
  view: OverviewView;
  role: AdminRole;
  onNavigate: (view: string) => void;
}) {
  const [state, setState] = useState(createAdminReviewState);
  const [online, setOnline] = useState(true);
  const [sessionValid, setSessionValid] = useState(true);
  const [canReview, setCanReview] = useState(true);
  const context: ReviewContext = { role, actor: "Nadia Permata", online, sessionValid, canReview };
  if (role !== "superadmin" && !(role === "finance" && view === "calendar"))
    return (
      <p role="alert" className="rounded-control bg-warning-bg p-5 text-sm text-warning">
        Akses ringkasan dan tinjauan vendor memerlukan scope Superadmin yang sesuai.
      </p>
    );
  return (
    <div className="grid min-w-0 gap-6">
      {view === "executive" ? (
        <AdminExecutive onNavigate={onNavigate} />
      ) : view === "calendar" ? (
        <AdminMasterCalendar role={role} />
      ) : (
        <AdminReviewBoard
          key={view}
          kind={view}
          state={state}
          onState={setState}
          context={context}
        />
      )}
      <details className="rounded-control border border-ux-border p-3 text-xs text-secondary">
        <summary className="min-h-8 font-medium">Skenario pemeriksaan internal</summary>
        <div className="mt-2 flex flex-wrap gap-5">
          {[
            ["Terhubung", online, setOnline],
            ["Sesi aktif", sessionValid, setSessionValid],
            ["Izin pemeriksa aktif", canReview, setCanReview],
          ].map(([label, value, set]) => (
            <label key={label as string} className="flex min-h-11 items-center gap-3">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => (set as (value: boolean) => void)(e.target.checked)}
              />
              {label as string}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
