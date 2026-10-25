export function safeReturnTo(value: string | null): string {
  if (
    value &&
    [
      "/marketplace",
      "/marketplace/bundles",
      "/planner/calendar",
      "/planner/rundown",
      "/planner/seserahan",
      "/planner/emergency",
      "/planner/catering",
      "/planner/tasks",
      "/planner/kua",
      "/planner/guests",
      "/planner/finance",
      "/planner/invitations",
      "/account/plans",
      "/planner/moodboard",
      "/planner/invitations/studio",
      "/planner/wedding-kit",
      "/account/security",
    ].includes(value)
  )
    return value;
  if (value && /^\/join\/[a-f0-9]{64}$/.test(value)) return value;
  if (value === "/account" || value === "/dashboard" || value === "/checkout/qris") return value;
  if (
    value &&
    /^\/checkout\/qris\?intent=[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(
      value,
    )
  )
    return value;
  return "/account";
}

export function browserReturnTo(): string {
  const params = new URLSearchParams(window.location.search);
  return safeReturnTo(params.get("returnTo") ?? params.get("callbackUrl"));
}

export function browserAuthDestination(): string {
  const params = new URLSearchParams(window.location.search);
  const target =
    params.has("returnTo") || params.has("callbackUrl") ? browserReturnTo() : "/dashboard";
  return `/auth/complete?returnTo=${encodeURIComponent(target)}`;
}
