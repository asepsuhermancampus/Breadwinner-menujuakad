import type { OnboardingDraft } from "@/features/planner-workspaces/contracts";

export const workspaceFixture: OnboardingDraft = {
  workspaceId: "workspace-couple",
  actorId: "actor-risa",
  version: 1,
  profile: {
    groom: {
      fullName: "Andi Ramadhan",
      nickname: "Andi",
      father: "Bapak H. Budi Santoso",
      mother: "Ibu Hj. Siti Aminah",
      photoUrl: null,
    },
    bride: {
      fullName: "Risa Pratiwi",
      nickname: "Risa",
      father: "Bapak H. Dedi Prasetyo",
      mother: "Ibu Hj. Ratna Dewi",
      photoUrl: null,
    },
    culture: "Jawa modern",
    actorRole: "bride",
  },
  scope: "both",
  events: {
    engagement: {
      id: "event-engagement",
      kind: "engagement",
      date: "2026-11-22",
      city: "Bandung, Jawa Barat",
      venue: "Rumah keluarga Risa",
      address: "Bandung",
      budgetIdr: 20_000_000,
      guestEstimate: 100,
    },
    wedding: {
      id: "event-wedding",
      kind: "wedding",
      date: "2027-02-14",
      city: "Bandung, Jawa Barat",
      venue: "Bumi Samami",
      address: "Jl. Terusan Cigadung No. 15 · Coblong, Bandung",
      budgetIdr: 150_000_000,
      guestEstimate: 500,
    },
  },
  invite: null,
  members: [{ actorId: "actor-risa", workspaceId: "workspace-couple", role: "owner" }],
};
