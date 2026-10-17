"use client";
import { useMemo } from "react";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import type { AuthMode } from "@/features/auth/types/auth-contracts";
import { createMockAuth } from "../adapters/mock-auth";
import { PreviewNotice } from "./preview-notice";

export function PreviewAuth({ mode }: { mode: AuthMode }) {
  const adapter = useMemo(() => createMockAuth(), []);
  return (
    <>
      <PreviewNotice />
      <AuthScreen mode={mode} adapter={adapter} />
    </>
  );
}
