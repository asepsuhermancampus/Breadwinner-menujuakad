"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useDashboardSession } from "../hooks/use-dashboard-session";
import { useWorkspaceMembership } from "../hooks/use-workspace-membership";
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
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { orderedCoupleIdentities } from "../domain/profile-names";
import { CustomerFeatureLayout } from "./customer-feature-layout";
import { CustomerNamesContext } from "./customer-names-context";
import { defaultSideNames, sideProfileNames } from "../domain/side-profile-names";
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
  const [event] = useEventPreference();
  const invalidated = useDashboardSession(access);
  useWorkspaceMembership(access);
  const sideNames =
    access.mode === "account"
      ? sideProfileNames(access.workspace.profile, access.workspace.ownerSide)
      : defaultSideNames;
  const content = <CustomerNamesContext value={sideNames}>{children}</CustomerNamesContext>;
  const identities = orderedCoupleIdentities(access.workspace.profile, access.workspace.ownerSide);
  useEffect(() => {
    const query = matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  if (invalidated)
    return (
      <div className="p-6">
        <PageSkeleton label="Memperbarui sesi dashboard" />
      </div>
    );
  if (fullScreen)
    return (
      <div data-customer-ui data-editor-fullscreen>
        {access.mode === "guest" ? <TrialProvider>{content}</TrialProvider> : content}
        {access.mode === "account" && access.workspace.role === "owner" && (
          <SubscriptionExperience key={access.workspace.id} autoStart={autoStartGuide} />
        )}
      </div>
    );
  return (
    <CustomerEventContext value={event}>
      <div
        data-testid="customer-shell"
        data-customer-ui
        className={cn(
          styles.shell,
          styles.edgeToEdge,
          compact && styles.shellCompact,
          !compact && !narrow && styles.shellExpanded,
        )}
      >
        <div className={styles.dockRegion}>
          <CustomerSidebar
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
            name={identities[0]?.name || "Ruang kalian"}
            partnerName={identities[1]?.name || null}
            photoUrl={identities[0]?.photoUrl}
            partnerPhotoUrl={identities[1]?.photoUrl}
            plan={getPlan(access.workspace.subscription.planId).label}
          />
          <main id="main-content" tabIndex={-1} className={cn("app-scroll", styles.body)}>
            <CustomerFeatureLayout>
              {access.mode === "guest" ? <TrialProvider>{content}</TrialProvider> : content}
            </CustomerFeatureLayout>
          </main>
        </div>
        <Dialog open={open} onClose={() => setOpen(false)} title="Ruang rencana kalian" side>
          <CustomerSidebar close={() => setOpen(false)} mobile />
        </Dialog>
        {access.mode === "account" && access.workspace.role === "owner" && (
          <SubscriptionExperience key={access.workspace.id} autoStart={autoStartGuide} />
        )}
      </div>
    </CustomerEventContext>
  );
}
