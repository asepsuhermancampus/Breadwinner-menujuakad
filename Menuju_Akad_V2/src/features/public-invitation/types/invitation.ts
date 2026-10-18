export type PublicGuestInvitation = {
  token: string;
  guestName: string;
  maxQuota: number;
  rsvpStatus: "ATTENDING" | "DECLINED" | "PENDING";
  attendingPax: number;
  tableNumber: string;
  tableCategory: string;
  notes?: string;
  rsvpDeadline: string;
  eventDateText: string;
  venueText: string;
  isValid: boolean;
};
