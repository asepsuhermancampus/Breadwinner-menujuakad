"use client";
import { useState } from "react";
import { Select } from "@/components/ui/select";
import { AdminOverviewScreen } from "@/features/admin-operations/components/admin-overview-screen";
import { AdminFinanceScreen } from "@/features/admin-finance/components/admin-finance-screen";
import type { AdminFinanceView } from "@/features/admin-finance/types/admin-finance";
import {
  PlatformOperationsScreen,
  type PlatformOperationsView,
} from "@/features/platform-operations";
import { OperationsShell } from "@/features/operations-shell/components/operations-shell";
import type { AdminRole, OverviewView } from "@/features/admin-operations/types/admin";
import { adminNavigation, financeViews, platformViews } from "./operations-navigation";
export function PreviewAdmin() {
  const [view, setView] = useState("executive");
  const [role, setRole] = useState<AdminRole>("superadmin");
  const [financeView, setFinanceView] = useState<AdminFinanceView>("reconciliation");
  const [platformView, setPlatformView] = useState<PlatformOperationsView>("helpdesk");
  const [overviewView, setOverviewView] = useState<OverviewView>("executive");
  const financial = (financeViews as readonly string[]).includes(view);
  const platform = (platformViews as readonly string[]).includes(view);
  const permitted =
    role === "superadmin"
      ? null
      : role === "finance"
        ? ["calendar", ...financeViews]
        : ["notifications", "helpdesk", "owner-help"];
  const items = adminNavigation.flatMap((item) => {
    if (!permitted) return [item];
    if (item.children) {
      const children = item.children.filter((child) => permitted.includes(child.view));
      return children.length ? [{ ...item, children }] : [];
    }
    return item.view && permitted.includes(item.view) ? [item] : [];
  });
  function navigate(next: string) {
    if (permitted && !permitted.includes(next)) return;
    if ((financeViews as readonly string[]).includes(next))
      setFinanceView(next as AdminFinanceView);
    else if ((platformViews as readonly string[]).includes(next))
      setPlatformView(next as PlatformOperationsView);
    else setOverviewView(next as OverviewView);
    setView(next);
  }
  return (
    <OperationsShell
      roleLabel={role === "superadmin" ? "SUPERADMIN" : role.toUpperCase()}
      identity="Platform Operations"
      description="Akses terbatas · tim internal"
      account={
        role === "support" ? "Farah Support" : role === "finance" ? "Raka Finance" : "Nadia Permata"
      }
      title="Platform Operations"
      active={view}
      items={items}
      onNavigate={navigate}
    >
      <div className="min-w-0" hidden={!financial}>
        <AdminFinanceScreen view={financeView} role={role} />
      </div>
      <div className="min-w-0" hidden={!platform}>
        <PlatformOperationsScreen view={platformView} role={role} />
      </div>
      <div className="min-w-0" hidden={financial || platform}>
        <AdminOverviewScreen view={overviewView} role={role} onNavigate={navigate} />
      </div>
      <details className="rounded-control border border-ux-border p-3 text-xs text-secondary">
        <summary className="min-h-8">Scope pratinjau internal · tanpa akses produksi</summary>
        <div className="mt-3 max-w-xs">
          <Select
            label="Scope operator contoh"
            value={role}
            onChange={(e) => {
              const next = e.target.value as AdminRole;
              setRole(next);
              if (next === "support") {
                setPlatformView("helpdesk");
                setView("helpdesk");
              } else if (next === "finance") {
                setFinanceView("reconciliation");
                setView("reconciliation");
              } else {
                setOverviewView("executive");
                setView("executive");
              }
            }}
          >
            <option value="superadmin">Superadmin · Nadia</option>
            <option value="finance">Finance · Raka</option>
            <option value="support">Support · Farah</option>
          </Select>
        </div>
        <p className="mt-3">
          Role, izin tindakan, objek, event, paket, availability dan versi diperiksa terpisah pada
          adapter. OTP tidak memberi izin baru. Enforcement produksi masih memerlukan layanan
          server.
        </p>
      </details>
    </OperationsShell>
  );
}
