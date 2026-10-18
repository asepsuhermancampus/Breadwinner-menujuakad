"use client";

import { WorkspaceShell } from "@/features/shell-navigation/components/workspace-shell";
import { GuestCrmScreen } from "@/features/guest-crm/components/guest-crm-screen";
import { StudioScreen } from "@/features/invitation-studio/components/studio-screen";
import { ManagerScreen } from "@/features/invitation-manager/components/manager-screen";
import { PreviewNotice } from "./preview-notice";
import { initialGuestCrmFixture } from "../fixtures/guest-crm";
import { accountFixture } from "../fixtures/account";

function ShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreviewNotice />
      <WorkspaceShell
        name={accountFixture.profile.fullName}
        memberships={accountFixture.memberships}
      >
        {children}
      </WorkspaceShell>
    </>
  );
}

export function PreviewGuestCrm() {
  return (
    <ShellWrapper>
      <GuestCrmScreen initialGuests={initialGuestCrmFixture} />
    </ShellWrapper>
  );
}

export function PreviewInvitationStudio() {
  return (
    <ShellWrapper>
      <StudioScreen />
    </ShellWrapper>
  );
}

export function PreviewInvitationManager() {
  return (
    <ShellWrapper>
      <ManagerScreen />
    </ShellWrapper>
  );
}
