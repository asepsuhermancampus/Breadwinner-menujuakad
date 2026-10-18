import type { CheckinStaff, CheckinLog } from "@/features/check-in/types/checkin";

export const initialCheckinStaffFixture: CheckinStaff[] = [
  {
    id: "st-dina",
    name: "Dina",
    role: "Petugas Gerbang",
    gate: "Gerbang A",
    schedule: "14 Feb 2027 · 07.00–16.00 WIB",
    status: "Terjadwal",
  },
  {
    id: "st-raka",
    name: "Raka",
    role: "Petugas Gerbang",
    gate: "Gerbang B",
    schedule: "14 Feb 2027 · 07.00–16.00 WIB",
    status: "Terjadwal",
  },
  {
    id: "st-naya",
    name: "Naya",
    role: "Koordinator Acara",
    gate: "Semua Gerbang",
    schedule: "14 Feb 2027 · 07.00–16.00 WIB",
    status: "Terjadwal",
  },
];

export const initialCheckinLogsFixture: CheckinLog[] = [
  {
    id: "log-1",
    time: "10.18 WIB",
    guestName: "Keluarga Arif",
    arrivedPax: 4,
    tableNumber: "08",
    status: "Tervalidasi",
    gate: "Gerbang A",
    staffName: "Dina",
  },
  {
    id: "log-2",
    time: "10.16 WIB",
    guestName: "Dewi Anggraini",
    arrivedPax: 1,
    tableNumber: "07",
    status: "Tervalidasi",
    gate: "Gerbang A",
    staffName: "Dina",
  },
];
