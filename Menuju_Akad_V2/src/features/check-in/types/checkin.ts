export type CheckinStaff = {
  id: string;
  name: string;
  role: string;
  gate: string;
  schedule: string;
  status: "Terjadwal" | "Dicabut" | "Aktif";
};

export type CheckinLog = {
  id: string;
  time: string;
  guestName: string;
  arrivedPax: number;
  tableNumber: string;
  status: "Tervalidasi" | "Tertahan" | "Ditolak";
  gate: string;
  staffName: string;
};

export type CheckinStateFixture = {
  totalRsvp: number;
  validatedCount: number;
  remainingCount: number;
  activeStaff: CheckinStaff;
};
