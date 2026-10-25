"use client";
import { useEffect, useState } from "react";
import type { DashboardAccess } from "../domain/dashboard-access";
export function useDashboardSession(access: DashboardAccess) {
  const [invalidated, setInvalidated] = useState(false);
  useEffect(() => {
    const abort = new AbortController();
    let localSignOut = false;
    const signOutStarted = () => {
      localSignOut = true;
    };
    const signOutCancelled = () => {
      localSignOut = false;
    };
    const invalidate = () => {
      if (localSignOut) return;
      setInvalidated(true);
      window.location.reload();
    };
    const refresh = () => {
      void fetch("/api/auth/session", { cache: "no-store", signal: abort.signal })
        .then(async (response) => {
          if (!response.ok) return;
          const session = (await response.json()) as { user?: { email?: string } };
          const email = session.user?.email ?? null;
          if (
            !abort.signal.aborted &&
            (access.mode === "guest" ? email !== null : email !== access.identity)
          )
            invalidate();
        })
        .catch(() => {});
    };
    const visible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const channel =
      typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("next-auth") : null;
    const onMessage = (event: MessageEvent) => {
      if (event.data?.event === "session") invalidate();
    };
    channel?.addEventListener("message", onMessage);
    window.addEventListener("focus", refresh);
    window.addEventListener("dashboard:signout-start", signOutStarted);
    window.addEventListener("dashboard:signout-cancel", signOutCancelled);
    document.addEventListener("visibilitychange", visible);
    refresh();
    return () => {
      abort.abort();
      channel?.close();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("dashboard:signout-start", signOutStarted);
      window.removeEventListener("dashboard:signout-cancel", signOutCancelled);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [access.mode, access.identity]);
  return invalidated;
}
