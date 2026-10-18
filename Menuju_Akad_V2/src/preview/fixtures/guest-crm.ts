import type { GuestInvitation } from "@/features/guest-crm/types/guest";

export const initialGuestCrmFixture: GuestInvitation[] = [
  {
    id: "g-1",
    name: "Budi Santoso & Partner",
    contactPhone: "+6281234564601",
    group: "Keluarga Andi",
    quota: 2,
    rsvpStatus: "ATTENDING",
    attendingCount: 2,
    tableNumber: "04",
    tableCategory: "VIP",
    waConsent: true,
    waConsentDate: "20 Okt 2026",
    waConsentSource: "Formulir pendaftaran",
    waDeliveryStatus: "DELIVERED",
    waDeliveryTime: "10.20 WIB",
    personalToken: "token-budi-a7c6",
  },
  {
    id: "g-2",
    name: "Dewi Anggraini",
    contactPhone: "+6281399887820",
    group: "Teman",
    quota: 1,
    rsvpStatus: "ATTENDING",
    attendingCount: 1,
    tableNumber: "07",
    tableCategory: "Reguler",
    waConsent: true,
    waConsentDate: "21 Okt 2026",
    waConsentSource: "Formulir pendaftaran",
    waDeliveryStatus: "READ",
    waDeliveryTime: "10.20 WIB",
    personalToken: "token-dewi-b19d",
  },
  {
    id: "g-3",
    name: "Keluarga Arif",
    contactPhone: "+6281255443322",
    group: "Keluarga Risa",
    quota: 4,
    rsvpStatus: "ATTENDING",
    attendingCount: 4,
    tableNumber: "08",
    tableCategory: "Reguler",
    waConsent: true,
    waConsentDate: "19 Okt 2026",
    personalToken: "token-arif-c441",
  },
  {
    id: "g-4",
    name: "Rafi & Keluarga",
    contactPhone: "+6285122333042",
    group: "Kolega",
    quota: 3,
    rsvpStatus: "ATTENDING",
    attendingCount: 3,
    waConsent: true,
    waConsentDate: "22 Okt 2026",
    personalToken: "token-rafi-d882",
  },
  {
    id: "g-5",
    name: "Irma Sari",
    contactPhone: "+6281266775181",
    group: "Teman",
    quota: 2,
    rsvpStatus: "ATTENDING",
    attendingCount: 2,
    tableNumber: "02",
    tableCategory: "Reguler",
    waConsent: true,
    personalToken: "token-irma-e119",
  },
  {
    id: "g-6",
    name: "Reza Kurniawan",
    contactPhone: "+6287899119912",
    group: "Kolega",
    quota: 2,
    rsvpStatus: "DECLINED",
    attendingCount: 0,
    waConsent: false,
    personalToken: "token-reza-f330",
  },
  {
    id: "g-7",
    name: "Hana Putri",
    contactPhone: "+6282144336173",
    group: "Rekanan",
    quota: 2,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: true,
    personalToken: "token-hana-g774",
  },
  {
    id: "g-8",
    name: "Dimas & Istri",
    contactPhone: "+6281122334455",
    group: "Teman",
    quota: 2,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: false,
    personalToken: "token-dimas-h992",
  },
];

// Deterministic generator to reach exact prompt contract:
// 350 invitations, 600 quota, 170 attending (340 people), 30 declined, 150 pending, 240 consent, 330 valid phone
for (let i = 9; i <= 350; i++) {
  // First 8 items have 5 attending (12 pax), 1 declined (0 pax), 2 pending (0 pax), total quota 18
  // We need 165 more attending invitations to reach 170
  // Attending pax needed: 340 - 12 = 328 pax across 165 invitations
  const isAtt = i <= 173; // 5 + 165 = 170
  const isDec = !isAtt && i <= 202; // 1 + 29 = 30

  let attendingCount = 0;
  let quota = 2;
  if (isAtt) {
    attendingCount = i <= 171 ? 2 : 1; // 163 * 2 + 2 * 1 = 328 pax
    quota = attendingCount;
  } else if (isDec) {
    quota = 2;
  } else {
    // pending (148 items)
    // currently quota used: 18 + 328 (attending) + 58 (declined) = 404
    // remaining quota needed: 600 - 404 = 196 quota across 148 items: 48 items with 2, 100 items with 1
    quota = i <= 250 ? 2 : 1;
  }

  const waConsent = i <= 242; // 6 + 234 = 240
  const validPhone = i <= 330; // 8 + 322 = 330

  initialGuestCrmFixture.push({
    id: "g-" + i,
    name: "Tamu Undangan " + i,
    contactPhone: validPhone ? "+62812" + String(i).padStart(7, "0") : undefined,
    group:
      i % 4 === 0
        ? "Keluarga Andi"
        : i % 4 === 1
          ? "Keluarga Risa"
          : i % 4 === 2
            ? "Teman"
            : "Kolega",
    quota,
    rsvpStatus: isAtt ? "ATTENDING" : isDec ? "DECLINED" : "PENDING",
    attendingCount,
    waConsent,
    personalToken: "token-guest-" + i,
  });
}

export { initialTablesFixture } from "./guest-tables";
