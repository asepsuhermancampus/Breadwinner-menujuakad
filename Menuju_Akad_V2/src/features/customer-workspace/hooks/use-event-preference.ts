"use client";
import { useSyncExternalStore } from "react";
import type { CustomerEvent } from "../components/customer-event-context";
const key = "menuju-akad:event-context";
let fallback: CustomerEvent = "wedding";
function snapshot(): CustomerEvent {
  try {
    return sessionStorage.getItem(key) === "engagement" ? "engagement" : fallback;
  } catch {
    return fallback;
  }
}
function subscribe(update: () => void) {
  window.addEventListener(key, update);
  return () => window.removeEventListener(key, update);
}
function select(event: CustomerEvent) {
  fallback = event;
  try {
    sessionStorage.setItem(key, event);
  } catch {
    /* Keep the current tab usable. */
  }
  window.dispatchEvent(new Event(key));
}
export function useEventPreference() {
  const event = useSyncExternalStore(subscribe, snapshot, () => "wedding" as const);
  return [event, select] as const;
}
