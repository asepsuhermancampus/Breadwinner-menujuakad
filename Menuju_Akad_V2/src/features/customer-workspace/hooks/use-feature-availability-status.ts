"use client";
import { useEffect, useState } from "react";
import {
  availabilityFeatures,
  type AvailabilityFeature,
  type FeatureAvailability,
} from "../domain/feature-availability-catalog";
import type { DashboardAccess } from "../domain/dashboard-access";

export function useFeatureAvailabilityStatus(access: DashboardAccess) {
  const [availability, setAvailability] = useState<FeatureAvailability | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    let revision = 0;
    const parse = (value: Record<string, unknown>): FeatureAvailability =>
      Object.fromEntries(
        (Object.keys(availabilityFeatures) as AvailabilityFeature[]).map((key) => [
          key,
          value[key] === true,
        ]),
      ) as FeatureAvailability;
    const load = () => {
      const current = ++revision;
      void fetch("/api/workspace/feature-availability", { cache: "no-store", signal: abort.signal })
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((value: Record<string, unknown>) => {
          if (!abort.signal.aborted && current === revision) setAvailability(parse(value));
        })
        .catch(() => {
          if (!abort.signal.aborted && current === revision) setAvailability(parse({}));
        });
    };
    load();
    const timer = window.setInterval(load, 15000);
    window.addEventListener("focus", load);
    window.addEventListener("feature-availability-changed", load);
    return () => {
      abort.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", load);
      window.removeEventListener("feature-availability-changed", load);
    };
  }, [access.mode, access.workspace.id, access.workspace.role]);
  return availability;
}
