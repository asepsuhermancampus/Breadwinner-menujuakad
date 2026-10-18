export type GuestGroup = "Keluarga Andi" | "Keluarga Risa" | "Teman" | "Kolega" | "Rekanan" | "VIP";

export type RsvpStatus = "ATTENDING" | "DECLINED" | "PENDING";

export type WaDeliveryStatus = "DELIVERED" | "READ" | "PROCESSING" | "FAILED" | "UNSENT";

export type GuestInvitation = {
  id: string;
  name: string;
  contactPhone?: string | undefined;
  group: GuestGroup;
  quota: number;
  rsvpStatus: RsvpStatus;
  attendingCount: number;
  tableNumber?: string | undefined;
  tableCategory?: "Reguler" | "VIP" | undefined;
  waConsent: boolean;
  waConsentDate?: string | undefined;
  waConsentSource?: string | undefined;
  waDeliveryStatus?: WaDeliveryStatus | undefined;
  waDeliveryTime?: string | undefined;
  personalToken: string;
  isArchived?: boolean | undefined;
};

export type TableSeating = {
  id: string;
  number: string;
  name: string;
  category: "Reguler" | "VIP";
  capacity: number;
  assignedCount: number;
  assignedGuests: Array<{
    id: string;
    name: string;
    partySize: number;
    isVip?: boolean;
  }>;
};

export type WaMessageCampaignItem = {
  id: string;
  recipientName: string;
  phone: string;
  status: "Terkirim" | "Diproses" | "Gagal";
  detail: string;
  canRetry: boolean;
  sentAt: string;
};
