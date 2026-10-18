import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";
import type { MoodboardItem, AgreedColor } from "@/features/moodboards/types/moodboard";
import type { WeddingKitSection } from "@/features/wedding-kit/types/wedding-kit";
import type { DigitalOrderItem } from "@/features/digital-products/types/fulfillment";

export const seserahanFixture: SeserahanItem[] = [
  {
    id: "ses-1",
    name: "Set perhiasan kalung & cincin",
    category: "Perhiasan",
    estimatedCost: 5_000_000,
    actualCost: 5_000_000,
    isBought: true,
    pic: "Andi",
    imageSrc: "/assets/images/editorial-1.png",
    notes: "Emas putih 18K dengan kotak beludru hijau cypress.",
  },
  {
    id: "ses-2",
    name: "Perlengkapan ibadah & sajadah sutra",
    category: "Ibadah",
    estimatedCost: 850_000,
    actualCost: 850_000,
    isBought: true,
    pic: "Bersama",
    imageSrc: "/assets/images/editorial-5.png",
    notes: "Mukena sutra premium dan Al-Quran terjemahan.",
  },
  {
    id: "ses-3",
    name: "Skincare & makeup set",
    category: "Perawatan",
    estimatedCost: 1_500_000,
    actualCost: 1_200_000,
    isBought: true,
    pic: "Risa",
    imageSrc: "/assets/images/editorial-7.png",
    notes: "Paket perawatan wajah harian sesuai daftar Risa.",
  },
  {
    id: "ses-4",
    name: "Busana & kain kebaya brokat",
    category: "Busana",
    estimatedCost: 1_500_000,
    actualCost: 0,
    isBought: false,
    pic: "Risa",
    imageSrc: "/assets/images/editorial-4.png",
    notes: "Bahan kebaya brokat warna ivory champagne.",
  },
  {
    id: "ses-5",
    name: "Sepatu hak & tas pesta",
    category: "Aksesoris",
    estimatedCost: 950_000,
    actualCost: 0,
    isBought: false,
    pic: "Andi",
    imageSrc: "/assets/images/editorial-3.png",
    notes: "Ukuran sepatu 38, warna beige keemasan.",
  },
  {
    id: "ses-6",
    name: "Buah-buahan segar & kue tradisional",
    category: "Konsumsi",
    estimatedCost: 400_000,
    actualCost: 0,
    isBought: false,
    pic: "Bersama",
    imageSrc: "/assets/images/editorial-2.png",
    notes: "Keranjang buah hias dan wajik ketan khas Sunda.",
  },
];

export const moodboardFixture: MoodboardItem[] = [
  {
    id: "mb-1",
    title: "Taman yang intim",
    category: "Dekorasi",
    subtitle: "Venue outdoor · Dekorasi",
    imageSrc: "/assets/images/editorial-6.png",
    notes: "Nuansa pepohonan hijau dengan pergola kayu dan tirai putih.",
  },
  {
    id: "mb-2",
    title: "Kebaya ivory & melati",
    category: "Busana",
    subtitle: "Busana · Detail tekstur",
    imageSrc: "/assets/images/editorial-4.png",
    notes: "Sentuhan roncean melati segar dan payet mutiara halus.",
  },
  {
    id: "mb-3",
    title: "Emas yang tenang",
    category: "Detail",
    subtitle: "Seserahan · Perhiasan",
    imageSrc: "/assets/images/editorial-1.png",
    notes: "Aksen champagne gold hangat tanpa kilau berlebihan.",
  },
  {
    id: "mb-4",
    title: "Ibadah & detail hangat",
    category: "Detail",
    subtitle: "Seserahan · Cypress & cream",
    imageSrc: "/assets/images/editorial-5.png",
    notes: "Warna hijau cypress pekat berpadu renda ivory.",
  },
];

export const agreedPaletteFixture: AgreedColor[] = [
  { hex: "#1E3F32", name: "Cypress", role: "Warna Utama" },
  { hex: "#C9A66B", name: "Champagne", role: "Warna Aksen" },
  { hex: "#FBFBF9", name: "Canvas", role: "Warna Latar" },
];

export const weddingKitSectionsFixture: WeddingKitSection[] = [
  {
    id: "sec-tasks",
    name: "Checklist & tugas",
    detail: "25 tugas · PIC dan tenggat",
    selected: true,
  },
  { id: "sec-rundown", name: "Rundown acara", detail: "14 Feb 2027 · draf v4", selected: true },
  {
    id: "sec-contacts",
    name: "Kontak vendor & PIC",
    detail: "3 vendor · 4 PIC keluarga",
    selected: true,
  },
  {
    id: "sec-emergency",
    name: "Perlengkapan darurat",
    detail: "24 barang · 5 kategori tas",
    selected: true,
  },
  {
    id: "sec-catering",
    name: "Ringkasan katering",
    detail: "1.100 tamu · 2.420 sajian",
    selected: true,
  },
  {
    id: "sec-kua",
    name: "Checklist dokumen KUA",
    detail: "Hanya status verifikasi, tanpa salinan berkas",
    selected: false,
  },
];

export const digitalOrderFixture: DigitalOrderItem = {
  orderId: "DIG-SIM-49",
  productName: "Template Anggaran Pernikahan · GoogleSheets + Excel",
  amount: 49_000,
  currency: "IDR",
  paymentStatus: "verified",
  statusBadge: "AKSES MILIK PEMBELI",
  statusTitle: "Pembayaran terverifikasi",
  statusExplanation:
    "Entitlement dibuat idempoten dari transaksi yang valid. Akses dapat diunduh kapan pun.",
  entitlementId: "ent-sim-49-882016",
  deliveryMethod: "email",
  accessUrl: "https://drive.google.com/drive/folders/mock-template-49",
  receiptNumber: "REC-49-882",
};
