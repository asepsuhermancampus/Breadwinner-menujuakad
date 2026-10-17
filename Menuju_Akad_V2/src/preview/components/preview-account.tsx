"use client";
import { useEffect, useState } from "react";
import { AccountScreen } from "@/features/account/components/account-screen";
import type { AccountAdapter, AccountSnapshot } from "@/features/account/types/account";
import { WorkspaceShell } from "@/features/shell-navigation/components/workspace-shell";
import { Status } from "@/components/ui/status";
import { createMockAccount } from "../adapters/mock-account";
import { accountFixture } from "../fixtures/account";
import { latency, readStored } from "../adapters/mock-runtime";
import { accountStorageSchema } from "../adapters/storage-schema";
import { PreviewNotice } from "./preview-notice";

export function PreviewAccount({ tab }: { tab: "profile" | "security" | "plans" }) {
  const [runtime, setRuntime] = useState<{
    snapshot: AccountSnapshot;
    adapter: AccountAdapter;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      await latency();
      const stored = readStored("ma-v2-account");
      const parsed = accountStorageSchema.safeParse(stored);
      if (stored !== null && !parsed.success) {
        if (active)
          setError(
            "Data contoh lokal tidak valid. Gunakan Reset data contoh lokal pada menu Skenario uji.",
          );
        return;
      }
      const snapshot: AccountSnapshot = parsed.success
        ? { ...parsed.data, asOf: new Date().toISOString() }
        : { ...accountFixture, asOf: new Date().toISOString() };
      if (active) setRuntime({ snapshot, adapter: createMockAccount(snapshot) });
    }
    void load();
    return () => {
      active = false;
    };
  }, []);
  return (
    <>
      <PreviewNotice />
      {error ? (
        <main id="main-content" className="p-8">
          <Status tone="danger">{error}</Status>
        </main>
      ) : runtime ? (
        <WorkspaceShell
          name={runtime.snapshot.profile.fullName}
          memberships={runtime.snapshot.memberships}
        >
          <AccountScreen tab={tab} initial={runtime.snapshot} adapter={runtime.adapter} />
        </WorkspaceShell>
      ) : (
        <main id="main-content" className="p-8">
          <Status>Memuat ruang kalian…</Status>
        </main>
      )}
    </>
  );
}
