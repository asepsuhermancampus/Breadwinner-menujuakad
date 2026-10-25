"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useDashboardSession } from "../hooks/use-dashboard-session";
import type { DashboardAccess } from "../domain/dashboard-access";
import { SubscriptionExperience } from "@/features/subscriptions/components/subscription-experience";
import { TrialProvider } from "@/features/dashboard-trial/components/trial-provider";
import { Dialog } from "@/components/ui/dialog";
import { WorkspaceHeader } from "@/features/shell-navigation/components/workspace-header";
import { getPlan } from "@/features/plans/domain/catalog";
import { cn } from "@/lib/cn";
import styles from "@/features/shell-navigation/components/workspace-shell.module.css";
import { CustomerSidebar } from "./customer-sidebar";
import { CustomerEventContext } from "./customer-event-context";
import { useEventPreference } from "../hooks/use-event-preference";
export function CustomerShell({
  access,
  children,
  autoStartGuide = false,
  fullScreen = false,
}: {
  access: DashboardAccess;
  children: ReactNode;
  autoStartGuide?: boolean;
  fullScreen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [event, setEvent] = useEventPreference();
  const invalidated = useDashboardSession(access);
  useEffect(() => {
    const query = matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  if (invalidated)
    return (
      <p role="status" className="p-6">
        Memperbarui sesi dashboard…
      </p>
    );
  if (fullScreen)
    return (
      <>
        {access.mode === "guest" ? <TrialProvider>{children}</TrialProvider> : children}
        {access.mode === "account" && access.workspace.role === "owner" && (
          <SubscriptionExperience key={access.workspace.id} autoStart={autoStartGuide} />
        )}
      </>
    );
  return (
    <CustomerEventContext value={event}>
      <div
        data-testid="customer-shell"
        className={cn(
          styles.shell,
          compact && styles.shellCompact,
          !compact && !narrow && styles.shellExpanded,
        )}
      >
        <div className={styles.dockRegion}>
          <CustomerSidebar
            access={access}
            compact={compact || narrow}
            toggle={() => {
              setCompact(!(compact || narrow));
              setNarrow(false);
            }}
          />
        </div>
        <div data-app-canvas className={styles.canvas}>
          <WorkspaceHeader
            onOpenMenu={() => setOpen(true)}
            name={access.workspace.profile.fullName || "Ruang kalian"}
            partnerName={access.workspace.profile.partnerName}
            plan={getPlan(access.workspace.subscription.planId).label}
            event={event}
            onEventChange={setEvent}
          />
          <main id="main-content" className={styles.body}>
            {access.mode === "guest" ? <TrialProvider>{children}</TrialProvider> : children}
          </main>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)} title="Ruang rencana kalian" side>
          <CustomerSidebar access={access} close={() => setOpen(false)} mobile />
        </Dialog>
        {access.mode === "account" && access.workspace.role === "owner" && (
          <SubscriptionExperience key={access.workspace.id} autoStart={autoStartGuide} />
        )}
      </div>
    </CustomerEventContext>
  );
}
