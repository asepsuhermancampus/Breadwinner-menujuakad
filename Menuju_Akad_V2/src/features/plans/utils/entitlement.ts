import type { PlanEntitlement } from "../types/plans";

function jakartaCalendarTime(value: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(new Date(value));
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return Date.UTC(
    Number(values.get("year")),
    Number(values.get("month")) - 1,
    Number(values.get("day")),
  );
}

export function daysUntilPlanExpiry(expiresAt: string | null, asOf: string) {
  if (!expiresAt) return null;
  return Math.max(
    0,
    Math.round((jakartaCalendarTime(expiresAt) - jakartaCalendarTime(asOf)) / 86400000),
  );
}

export function entitlementLabel(entitlement: PlanEntitlement) {
  return { free: "Free", premium: "Premium", lifetime: "Lifetime" }[entitlement.plan];
}
