"use client";
import { useSyncExternalStore, type SetStateAction } from "react";
import { readUrlTab, urlWithTab } from "@/lib/url-tab";
const changeEvent = "menuju-akad:tab-change";
function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(changeEvent, listener);
  };
}
const current = () => window.location.search;
const initial = () => "";
export function useUrlSearch() {
  return useSyncExternalStore(subscribe, current, initial);
}
export function useUrlTab<T extends string>(key: string, values: readonly T[], fallback: T) {
  const value = readUrlTab(useUrlSearch(), key, values, fallback);
  function select(action: SetStateAction<T>) {
    const next =
      typeof action === "function"
        ? action(readUrlTab(window.location.search, key, values, fallback))
        : action;
    if (!values.includes(next)) return;
    window.history.replaceState(
      window.history.state,
      "",
      urlWithTab(window.location.href, key, next),
    );
    window.dispatchEvent(new Event(changeEvent));
  }
  return [value, select] as const;
}
