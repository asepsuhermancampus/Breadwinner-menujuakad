import type { MaintainedPlanningFeature } from "@/features/customer-planning/domain/maintenance-catalog";
async function checkAvailability(
  url: string,
  request: typeof fetch,
): Promise<"active" | "maintenance" | "disabled" | "unavailable"> {
  try {
    const response = await request(url, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!response.ok) return "unavailable";
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("status" in data)) return "unavailable";
    return data.status === "active" || data.status === "maintenance" || data.status === "disabled"
      ? data.status
      : "unavailable";
  } catch {
    return "unavailable";
  }
}
export function taskAvailability(request: typeof fetch = fetch) {
  return checkAvailability("/api/workspace/task-status", request);
}
export function vendorAvailability(request: typeof fetch = fetch) {
  return checkAvailability("/api/workspace/feature-status/vendors", request);
}
export function planningAvailability(
  feature: MaintainedPlanningFeature,
  request: typeof fetch = fetch,
) {
  return checkAvailability(`/api/workspace/feature-status/${feature}`, request);
}
