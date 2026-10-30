export const availabilityFeatures = {
  tasks: "Tugas",
  emergency: "Perlengkapan darurat",
  calendar: "Kalender koordinasi",
  moodboard: "Inspirasi & moodboard",
  documents: "Dokumen KUA",
  rundown: "Rundown acara",
  guests: "Pengelolaan tamu",
  finance: "Keuangan",
  support: "Bantuan",
  vendors: "Vendor",
  domain: "Custom domain",
  seserahan: "Seserahan",
  catering: "Katering",
  pdf: "Ringkasan cetak",
  invitations: "Editor undangan",
  "studio-drafts": "Studio visual",
} as const;
export type AvailabilityFeature = keyof typeof availabilityFeatures;
// Features appear here only after their connected data paths are protected.
export const controllableFeatures = [
  "tasks",
  "emergency",
  "calendar",
  "moodboard",
  "documents",
  "rundown",
  "guests",
  "finance",
  "support",
  "vendors",
  "domain",
  "seserahan",
  "catering",
  "pdf",
  "invitations",
  "studio-drafts",
] as const;
export function isControllableFeature(value: string): boolean {
  return (controllableFeatures as readonly string[]).includes(value);
}
export type FeatureAvailability = Record<AvailabilityFeature, boolean>;
const featurePaths: Record<AvailabilityFeature, string> = {
  tasks: "/planner/tasks",
  emergency: "/planner/emergency",
  calendar: "/planner/calendar",
  moodboard: "/planner/moodboard",
  documents: "/planner/kua",
  rundown: "/planner/rundown",
  guests: "/planner/guests",
  finance: "/planner/finance",
  support: "/account/support",
  vendors: "/marketplace",
  domain: "/account/domain",
  seserahan: "/planner/seserahan",
  catering: "/planner/catering",
  pdf: "/planner/wedding-kit",
  invitations: "/planner/invitations",
  "studio-drafts": "/planner/invitations/studio",
};
export function defaultFeatureAvailability(value: boolean): FeatureAvailability {
  return Object.fromEntries(
    (Object.keys(availabilityFeatures) as AvailabilityFeature[]).map((feature) => [feature, value]),
  ) as FeatureAvailability;
}
export function isAvailableFeaturePath(path: string, available: FeatureAvailability) {
  const feature = availabilityFeatureForPath(path);
  return feature ? available[feature] : true;
}
export function availabilityFeatureForPath(path: string) {
  if (path === "/checkin") return "guests";
  if (path === "/checkout/services" || path.startsWith("/marketplace/")) return "vendors";
  return (Object.keys(featurePaths) as AvailabilityFeature[]).find(
    (key) => featurePaths[key] === path,
  );
}
export function availableNavigationDestination(
  item: { href: string; children?: { href: string }[] },
  available: FeatureAvailability,
) {
  if (isAvailableFeaturePath(item.href, available)) return item.href;
  return (
    item.children?.find((child) => isAvailableFeaturePath(child.href, available))?.href ?? null
  );
}
export function isAvailabilityFeature(value: string): value is AvailabilityFeature {
  return Object.hasOwn(availabilityFeatures, value);
}
