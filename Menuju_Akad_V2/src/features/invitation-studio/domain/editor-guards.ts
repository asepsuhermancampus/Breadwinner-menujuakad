import type { EditorState, StudioDocument } from "../types/editor";
import { isSafeStudioImage } from "./editor-storage";

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function sameDocument(first: StudioDocument, second: StudioDocument) {
  return JSON.stringify(first) === JSON.stringify(second);
}

export function saveProblem(state: EditorState): EditorState["saveStatus"] | null {
  if (!state.environment.online) return "offline";
  if (!state.environment.canEdit) return "forbidden";
  if (state.environment.serverVersion !== state.document.expectedVersion) return "conflict";
  if (state.environment.saveFailure) return "error";
  return null;
}

export const saveMessages = {
  offline:
    "Offline. Perubahan lokal tetap tersimpan di perangkat; sambungkan untuk menyimpan draf.",
  forbidden: "Akses edit dicabut. Draf lokal dipertahankan; hubungi pemilik acara.",
  conflict: "Versi server berubah. Bandingkan lalu pilih versi yang akan disimpan.",
  error: "Simulasi simpan gagal. Draf lokal aman; coba lagi setelah masalah selesai.",
} as const;

export function getPublishBlockers(state: EditorState): string[] {
  const { document, environment } = state;
  const blockers: string[] = [];
  if (!environment.online) blockers.push("Sambungkan internet sebelum menerbitkan.");
  if (!environment.canEdit) blockers.push("Izin edit acara diperlukan.");
  if (!environment.entitled) blockers.push("Akses paket untuk tema ini tidak tersedia.");
  if (!environment.available) blockers.push("Penerbitan sedang tidak tersedia.");
  if (document.draftStatus !== "editing")
    blockers.push("Pulihkan atau buat draf aktif terlebih dahulu.");
  if (document.expectedVersion !== environment.serverVersion)
    blockers.push("Selesaikan konflik versi server.");
  if (state.dirty || !sameDocument(document, state.savedDocument))
    blockers.push("Simpan perubahan terbaru sebelum menerbitkan.");
  if (environment.saveFailure) blockers.push("Selesaikan kegagalan simpan draf.");
  if (environment.upload === "pending") blockers.push("Tunggu unggahan aset selesai.");
  if (environment.upload === "error") blockers.push("Ulangi atau batalkan unggahan yang gagal.");
  const { groom, bride, date, venue, rsvpDeadline, coupleTitle } = document.content;
  if (
    ![groom, bride, date, venue, rsvpDeadline, coupleTitle, document.title].every((value) =>
      value.trim(),
    )
  )
    blockers.push("Lengkapi nama pasangan, judul, tanggal, lokasi, dan batas RSVP.");
  if (!document.content.pinSet) blockers.push("Tetapkan pin lokasi acara.");
  if (!validDate(date) || !validDate(rsvpDeadline))
    blockers.push("Masukkan tanggal acara dan batas RSVP yang valid.");
  else if (rsvpDeadline > date) blockers.push("Batas RSVP tidak boleh melewati tanggal acara.");
  if (!isSafeStudioImage(document.cover.src) || !isSafeStudioImage(document.cover.originalSrc))
    blockers.push("Pilih aset gambar raster lokal yang valid.");
  if (
    document.privacy.giftsEnabled ||
    document.sections.some((section) => section.id === "gifts" && section.visible)
  )
    blockers.push("Hadiah masih nonaktif pada rilis ini.");
  if (document.assetsUsedMb > 100) blockers.push("Pemakaian aset melebihi kuota 100 MB.");
  return blockers;
}

export function statusFor(state: EditorState): EditorState["saveStatus"] {
  return saveProblem(state) ?? (state.dirty ? "dirty" : "saved");
}

export function failureNotice(status: EditorState["saveStatus"]) {
  return status in saveMessages ? saveMessages[status as keyof typeof saveMessages] : "";
}
