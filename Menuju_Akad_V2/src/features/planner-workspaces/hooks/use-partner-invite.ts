"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { OnboardingDraft, WorkspaceAdapter } from "../contracts";
import { inviteState } from "../utils/invite-policy";

export function usePartnerInvite(
  draft: OnboardingDraft,
  adapter: WorkspaceAdapter,
  reload: () => Promise<void>,
) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(() => adapter.now());
  const locked = useRef(false);
  const state = draft.invite ? inviteState(draft.invite, now) : "empty";

  useEffect(() => {
    const timer = window.setInterval(() => setNow(adapter.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [adapter]);

  const run = useCallback(
    async (operation: () => Promise<unknown>) => {
      if (locked.current) return;
      locked.current = true;
      setBusy(true);
      setMessage("");
      try {
        await operation();
        await reload();
      } catch (failure) {
        setMessage(failure instanceof Error ? failure.message : "Tautan belum dapat diproses.");
      } finally {
        locked.current = false;
        setBusy(false);
      }
    },
    [reload],
  );

  useEffect(() => {
    const invite = draft.invite;
    if (!invite || invite.status !== "pending") return;
    const timer = window.setInterval(() => {
      if (locked.current) return;
      adapter
        .getInvite(invite.token)
        .then((latest) => {
          if (latest.status !== invite.status) void reload();
        })
        .catch(() => {});
    }, 3_000);
    return () => window.clearInterval(timer);
  }, [adapter, draft.invite, reload]);

  return {
    state,
    busy,
    message,
    create: () => run(() => adapter.createInvite(draft.workspaceId)),
    revoke: () => run(() => adapter.revokeInvite(draft.invite?.token ?? "")),
    check: () =>
      run(async () => {
        if (draft.invite) await adapter.getInvite(draft.invite.token);
      }),
  };
}
