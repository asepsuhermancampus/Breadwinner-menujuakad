import { invitationProjects } from "../../invitation-manager/content/manager-content";
import type { StudioDocument, StudioNode } from "../types/editor";

export const studioSections = [
  ["cover", "Sampul"],
  ["quote", "Kutipan"],
  ["couple", "Mempelai"],
  ["event", "Detail acara"],
  ["map", "Peta & denah"],
  ["story", "Cerita cinta"],
  ["gallery", "Galeri"],
  ["rsvp", "RSVP & ucapan"],
  ["gifts", "Hadiah"],
  ["closing", "Penutup"],
] as const;

function createNode(patch: Partial<StudioNode> & Pick<StudioNode, "id" | "name">): StudioNode {
  return {
    kind: "text",
    text: "",
    x: 24,
    y: 0,
    width: 327,
    height: 24,
    fontSize: 14,
    lineHeight: 1.5,
    rotation: 0,
    opacity: 100,
    visible: true,
    locked: false,
    flipX: false,
    flipY: false,
    ...patch,
  };
}

export function createStudioDocument(projectId = "inv-wedding-main"): StudioDocument {
  const project = invitationProjects.find((item) => item.id === projectId);
  const engagement = project?.kind === "ENGAGEMENT";
  const activeVersion = project?.activeVersion ?? null;
  const revision = project?.draftVersion ?? 1;
  const src = "/assets/images/generated.png";
  return {
    projectId,
    eventId: engagement ? "event-engagement" : "event-wedding",
    title: project?.title ?? "Undangan baru",
    theme: "editorial",
    revision,
    expectedVersion: revision,
    activeVersion,
    publication: activeVersion === null ? "unpublished" : "published",
    draftStatus: "editing",
    content: {
      groom: "Andi Ramadhan",
      bride: "Risa Pratiwi",
      date: engagement ? "2026-11-22" : "2027-02-14",
      venue: "Bumi Samami, Bandung",
      pinSet: true,
      rsvpDeadline: engagement ? "2026-11-15" : "2027-02-07",
      coupleTitle: "Andi & Risa",
    },
    nodes: [
      createNode({
        id: "cover",
        name: "Foto sampul",
        kind: "image",
        x: 0,
        y: 0,
        width: 375,
        height: 340,
        locked: true,
      }),
      createNode({
        id: "eyebrow",
        name: "Label pernikahan",
        text: "THE WEDDING OF",
        y: 361,
        fontSize: 10,
        height: 15,
      }),
      createNode({
        id: "couple-title",
        name: "Nama pasangan",
        text: "Andi & Risa",
        y: 389,
        fontSize: 54,
        lineHeight: 1,
        height: 54,
      }),
      createNode({
        id: "event-date",
        name: "Tanggal acara",
        text: engagement ? "Minggu, 22 November 2026" : "Minggu, 14 Februari 2027",
        y: 463,
      }),
      createNode({
        id: "ceremony",
        name: "Sesi acara",
        text: "Akad 08.00 · Resepsi 10.00 WIB",
        y: 493,
      }),
      createNode({ id: "venue", name: "Lokasi acara", text: "Bumi Samami, Bandung", y: 523 }),
    ],
    sections: studioSections.map(([id, label]) => ({ id, label, visible: id !== "gifts" })),
    cover: { src, originalSrc: src, crop: { x: 50, y: 50, scale: 1, ratio: "375:340" } },
    motion: { effect: "fade", duration: 600, delay: 0, loop: false, reducedMotion: false },
    privacy: { giftsEnabled: false, searchEngineIndex: false, autoplayMusic: false },
    assetsUsedMb: 42,
  };
}

export const studioHistory = [
  { version: 4, actor: "Anda", time: "25 Okt 2026 · 10.42", label: "Draf tersimpan" },
  { version: 3, actor: "Andi", time: "24 Okt 2026 · 16.20", label: "Versi aktif" },
  { version: 2, actor: "Risa", time: "23 Okt 2026 · 14.10", label: "Konten awal" },
] as const;

export function createHistoryDocument(document: StudioDocument): StudioDocument {
  const baseline = createStudioDocument(document.projectId);
  return {
    ...baseline,
    eventId: document.eventId,
    activeVersion: document.activeVersion,
    publication: document.publication,
    expectedVersion: document.expectedVersion,
    revision: 2,
    content: { ...baseline.content, coupleTitle: "Andi dan Risa", venue: "Bumi Samami, Bandung" },
    nodes: baseline.nodes.map((node) => {
      if (node.id === "couple-title") return { ...node, text: "Andi dan Risa" };
      if (node.id === "venue") return { ...node, text: "Bumi Samami, Bandung" };
      return structuredClone(node);
    }),
  };
}
