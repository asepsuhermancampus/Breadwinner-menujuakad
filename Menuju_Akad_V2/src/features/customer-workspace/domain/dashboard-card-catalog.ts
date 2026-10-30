export const dashboardCardLabels = {
  tasks: "Tugas",
  documents: "Dokumen KUA",
  budget: "Anggaran",
  guests: "Tamu",
  priorities: "Fokus dan agenda",
  "quick-links": "Langkah perencanaan",
} as const;
export type DashboardCard = keyof typeof dashboardCardLabels;
export const dashboardAudiences = {
  guest: "Tamu percobaan",
  owner: "Pemilik",
  partner: "Pasangan",
} as const;
export type DashboardAudience = keyof typeof dashboardAudiences;
export function isDashboardCard(value: string): value is DashboardCard {
  return Object.hasOwn(dashboardCardLabels, value);
}
export function isDashboardAudience(value: string): value is DashboardAudience {
  return Object.hasOwn(dashboardAudiences, value);
}
