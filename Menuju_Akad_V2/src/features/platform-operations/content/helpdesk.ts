import type { Ticket, TicketMessage } from "../types/operations";
export const tickets: Ticket[] = [
  {
    id: "TK-2048",
    ownerId: "andi",
    owner: "Andi Ramadhan",
    title: "RSVP per sesi",
    priority: "P2",
    status: "Ditangani",
    version: 3,
    assigned: true,
  },
  {
    id: "TK-2051",
    ownerId: "vendor-other",
    owner: "Mitra Vendor",
    title: "Status payout",
    priority: "P1",
    status: "Tim Keuangan",
    version: 2,
    assigned: false,
  },
  {
    id: "TK-2052",
    ownerId: "vendor-kyb",
    owner: "Mitra Vendor",
    title: "Revisi KYB",
    priority: "P2",
    status: "Menunggu vendor",
    version: 1,
    assigned: false,
  },
  {
    id: "TK-2053",
    ownerId: "couple-other",
    owner: "Pemilik undangan",
    title: "Link undangan",
    priority: "P3",
    status: "Baru",
    version: 1,
    assigned: false,
  },
];
export const initialMessages: TicketMessage[] = [
  {
    id: "message-1",
    author: "Andi · 10.20",
    text: "Akad 1 orang dan Resepsi 2 orang. Apakah ini berarti 3 tamu unik?",
    internal: false,
  },
  {
    id: "message-2",
    author: "Farah · 10.24",
    text: "Tidak selalu. Jawaban disimpan per sesi; orang yang sama tidak dijumlahkan dua kali sebagai orang unik.",
    internal: false,
  },
];
