"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DashboardAccess } from "../domain/dashboard-access";
import type { CustomerWorkspace } from "../types";
export function useWorkspaceMembership(access: DashboardAccess) {
  const router = useRouter();
  const id = access.workspace.id,
    role = access.workspace.role,
    revision = access.workspace.revision;
  const mode = access.mode,
    status = access.workspace.partnerAccess?.state;
  useEffect(() => {
    if (mode !== "account") return;
    const controller = new AbortController();
    let checking = false,
      refreshing = false;
    async function check() {
      if (checking || controller.signal.aborted) return;
      checking = true;
      try {
        const response = await fetch("/api/workspace", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const body = (await response.json()) as { workspace: CustomerWorkspace };
        if (controller.signal.aborted) return;
        if (body.workspace.id !== id || body.workspace.role !== role) {
          window.location.reload();
          return;
        }
        if (
          !refreshing &&
          (body.workspace.revision !== revision || body.workspace.partnerAccess?.state !== status)
        ) {
          refreshing = true;
          router.refresh();
        }
      } catch {
      } finally {
        checking = false;
      }
    }
    const visible = () => {
      if (document.visibilityState === "visible") void check();
    };
    const timer = window.setInterval(visible, 10000);
    window.addEventListener("focus", visible);
    window.addEventListener("workspace:membership-changed", visible);
    document.addEventListener("visibilitychange", visible);
    void check();
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", visible);
      window.removeEventListener("workspace:membership-changed", visible);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [id, role, revision, status, mode, router]);
}
