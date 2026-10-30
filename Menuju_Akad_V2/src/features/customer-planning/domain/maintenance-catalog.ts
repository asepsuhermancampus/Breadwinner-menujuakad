export const planningMaintenanceFeatures = {
  calendar: "Kalender koordinasi",
  rundown: "Rundown acara",
  emergency: "Perlengkapan darurat",
  documents: "Dokumen KUA",
  moodboard: "Moodboard",
  catering: "Katering",
  seserahan: "Seserahan",
  guests: "Pengelolaan tamu",
  invitations: "Editor undangan",
  "studio-drafts": "Studio undangan",
  finance: "Keuangan",
  pdf: "Ringkasan cetak",
} as const;
export type MaintainedPlanningFeature = keyof typeof planningMaintenanceFeatures;
export function isMaintainedPlanningFeature(value: string): value is MaintainedPlanningFeature {
  return Object.hasOwn(planningMaintenanceFeatures, value);
}
