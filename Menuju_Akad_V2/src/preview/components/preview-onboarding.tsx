"use client";
import { useMemo } from "react";
import { OnboardingScreen } from "@/features/planner-workspaces/components/onboarding-screen";
import { JoinPartnerScreen } from "@/features/planner-workspaces/components/join-partner-screen";
import type { OnboardingStep } from "@/features/planner-workspaces/contracts";
import { createMockWorkspace } from "../adapters/mock-workspace";
import { workspaceFixture } from "../fixtures/workspace";
import { PreviewNotice } from "./preview-notice";

export function PreviewOnboarding({ step }: { step: OnboardingStep }) {
  const adapter = useMemo(() => createMockWorkspace(workspaceFixture), []);
  return (
    <>
      <PreviewNotice />
      <OnboardingScreen step={step} initial={workspaceFixture} adapter={adapter} />
    </>
  );
}
export function PreviewJoin({ token }: { token: string }) {
  const adapter = useMemo(() => createMockWorkspace(workspaceFixture), []);
  return (
    <>
      <PreviewNotice />
      <JoinPartnerScreen token={token} actorId="actor-andi" adapter={adapter} />
    </>
  );
}
