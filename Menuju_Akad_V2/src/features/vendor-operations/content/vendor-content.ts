import type { VendorContext, VendorWorkspace } from "../types/vendor";
import { createVendorOrders } from "./vendor-orders";

export const vendorSnapshotTime = "2026-10-25T10:42:00+07:00";

export function createVendorWorkspace(): VendorWorkspace {
  return {
    vendorId: "vendor-kalyana",
    ownerId: "vendor-owner-aditya",
    version: 1,
    catalog: {
      profile: {
        name: "Kalyana Photography & Cinema",
        ownerName: "Aditya Pramana",
        category: "Fotografi & Videografi",
        city: "Bandung",
        address: "Bandung, Jawa Barat",
        pinSet: true,
        description: "Dokumentasi pernikahan yang hangat, jujur, dan dekat dengan cerita Anda.",
        cover: "/assets/images/generated.png",
      },
      packages: [
        {
          id: "package-akad",
          name: "Akad intimate",
          description: "Dokumentasi akad dan momen keluarga.",
          priceIdr: 7_500_000,
          active: true,
          duration: "4 jam",
          deliverables: ["Dokumentasi foto", "Pilihan foto hasil kurasi"],
          image: "/assets/images/generated.png",
        },
        {
          id: "package-full-day",
          name: "Wedding full day",
          description: "Dokumentasi rangkaian hari pernikahan.",
          priceIdr: 15_000_000,
          active: true,
          duration: "Full day",
          deliverables: ["Dokumentasi foto dan video", "Film pernikahan"],
          image: "/assets/images/generated.png",
        },
        {
          id: "package-cinema",
          name: "Cinema add-on",
          description: "Film tambahan untuk rangkaian hari pernikahan.",
          priceIdr: 5_000_000,
          active: true,
          duration: "1 sesi",
          deliverables: ["Dokumentasi sinematik", "Film hasil kurasi"],
          image: "/assets/images/generated.png",
        },
      ],
    },
    kyb: {
      step: 3,
      totalSteps: 4,
      version: 3,
      status: "revision-required",
      verifiedBank: { bankName: "BCA", accountName: "Kalyana Photography & Cinema", last4: "1188" },
      proposedBank: {
        bankName: "Mandiri",
        accountName: "Kalyana Photography & Cinema",
        last4: "6402",
        status: "revision-required",
        evidence: null,
        submittedAt: null,
      },
    },
    orders: createVendorOrders(),
    audit: [],
    operations: {},
  };
}

export function createVendorContext(state = createVendorWorkspace()): VendorContext {
  return {
    role: "vendor",
    vendorId: state.vendorId,
    actorId: state.ownerId,
    permissions: {
      catalogWrite: true,
      kybSubmit: true,
      orderDecide: true,
      calendarWrite: true,
      payoutRequest: true,
    },
    online: true,
    sessionValid: true,
    sandbox: true,
    availability: "hidden",
    latestVersion: state.version,
    slotAvailable: true,
    uploadState: "idle",
    now: () => new Date().toISOString(),
  };
}
