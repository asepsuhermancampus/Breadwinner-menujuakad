"use client";
import { Status } from "@/components/ui/status";
import { hasPermission } from "../domain/guards";
import { useOperationContext } from "../hooks/use-operation-context";
import type { OperationsRole, PlatformOperationsView } from "../types/operations";
import { OperationScenario } from "./operation-ui";
import { NotificationsPanel } from "./notifications-panel";
import { HelpdeskPanel } from "./helpdesk-panel";
import { CmsPanel } from "./cms-panel";
import { HealthPanel } from "./health-panel";
import { AccountsPanel } from "./accounts-panel";
import { OwnerHelpPanel } from "./owner-help-panel";
import { OperationPanel } from "./operation-panel";

const viewPermission = {
  notifications: "notifications.read",
  helpdesk: "tickets.read",
  cms: "cms.write",
  health: "health.read",
  accounts: "accounts.write",
  "owner-help": "tickets.read",
};
export function PlatformOperationsScreen({
  view,
  role,
}: {
  view: PlatformOperationsView;
  role: OperationsRole;
}) {
  const operation = useOperationContext(role);
  const props = { role, scenario: operation.scenario, context: operation.context };
  const allowed = hasPermission(role, viewPermission[view]);
  const waiting = operation.scenario === "loading" || operation.scenario === "empty";
  const active = (name: PlatformOperationsView) =>
    allowed && view === name && (!waiting || name === "owner-help");
  return (
    <div className="grid min-w-0 gap-6" data-platform-view={view}>
      {!allowed && (
        <Status tone="danger">
          Halaman ini berada di luar scope {role}. Kembali ke menu yang tersedia untuk penugasan
          Anda.
        </Status>
      )}
      {allowed && waiting && view !== "owner-help" && (
        <Status>
          {operation.scenario === "loading"
            ? "Memuat data operasi…"
            : "Belum ada data pada antrean ini."}
        </Status>
      )}
      {allowed && !waiting && operation.scenario !== "ready" && view !== "owner-help" && (
        <Status tone={operation.scenario === "offline" ? "warning" : "danger"}>
          {operation.scenario === "offline"
            ? "Offline. Draf lokal tetap tersedia; aksi belum tersinkron."
            : operation.scenario === "revoked"
              ? "Izin atau sesi dicabut. Muat ulang setelah akses dipulihkan."
              : operation.scenario === "stale"
                ? "Versi server disimulasikan berubah; tindakan perlu review baru."
                : "Sinkronisasi gagal disimulasikan. Tidak ada perubahan diterapkan."}
        </Status>
      )}
      {hasPermission(role, "notifications.read") && (
        <OperationPanel active={active("notifications")}>
          <NotificationsPanel {...props} />
        </OperationPanel>
      )}
      {hasPermission(role, "tickets.read") && (
        <OperationPanel active={active("helpdesk")}>
          <HelpdeskPanel {...props} />
        </OperationPanel>
      )}
      {hasPermission(role, "cms.write") && (
        <OperationPanel active={active("cms")}>
          <CmsPanel {...props} />
        </OperationPanel>
      )}
      {hasPermission(role, "health.read") && (
        <OperationPanel active={active("health")}>
          <HealthPanel {...props} />
        </OperationPanel>
      )}
      {hasPermission(role, "accounts.write") && (
        <OperationPanel active={active("accounts")}>
          <AccountsPanel {...props} />
        </OperationPanel>
      )}
      {hasPermission(role, "tickets.read") && (
        <OperationPanel active={active("owner-help")}>
          <OwnerHelpPanel />
        </OperationPanel>
      )}
      {allowed && view !== "owner-help" && (
        <OperationScenario scenario={operation.scenario} onChange={operation.setScenario} />
      )}
    </div>
  );
}
