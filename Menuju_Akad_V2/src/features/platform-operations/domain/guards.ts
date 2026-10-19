import type { Feedback, GateContext, OperationsRole } from "../types/operations";

const permissions: Record<OperationsRole, string[]> = {
  superadmin: [
    "notifications.read",
    "notifications.dispatch",
    "tickets.read",
    "tickets.write",
    "cms.write",
    "health.read",
    "maintenance.draft",
    "accounts.write",
  ],
  support: ["notifications.read", "tickets.read", "tickets.write"],
  finance: ["notifications.read", "health.read"],
};
export const blocked = (message: string): Feedback => ({ ok: false, message });
export const accepted = (message: string): Feedback => ({ ok: true, message });
export function hasPermission(role: OperationsRole, action: string) {
  return permissions[role].includes(action);
}
export function guardOperation(context: GateContext): Feedback {
  if (context.scenario === "loading" || context.scenario === "empty")
    return blocked("Data belum siap. Muat data sebelum melakukan tindakan.");
  if (context.sessionValid === false || context.scenario === "revoked")
    return blocked("Izin atau sesi dicabut. Perubahan belum diterapkan.");
  if (!hasPermission(context.role, context.action))
    return blocked("Scope Anda tidak mengizinkan tindakan ini.");
  if (context.ownerId && context.ownerId !== context.actorId && !context.assigned)
    return blocked("Objek ini berada di luar penugasan atau kepemilikan Anda.");
  if (context.eventId && !context.eventScope?.includes(context.eventId))
    return blocked("Delegasi tidak mencakup acara ini.");
  if (context.entitlement === false) return blocked("Entitlement tidak mencakup tindakan ini.");
  const availability =
    context.parentAvailability && context.parentAvailability !== "Live"
      ? context.parentAvailability
      : (context.availability ?? "Live");
  if (availability !== "Live")
    return blocked(`Fitur ${availability}. Gunakan bantuan historis yang terotorisasi.`);
  if (context.scenario === "offline")
    return blocked("Anda offline. Draf tetap di perangkat; belum tersinkron.");
  if (context.scenario === "stale" || context.expectedVersion !== context.version)
    return blocked("Versi berubah. Muat ulang data dan tinjau kembali sebelum melanjutkan.");
  if (context.scenario === "failure")
    return blocked("Simulasi sinkronisasi gagal. Belum ada perubahan; aman untuk mencoba lagi.");
  return accepted("Pemeriksaan akses dan versi berhasil.");
}
export function ownerTicketAccess(ownerId: string, actorId: string, sessionValid: boolean) {
  return sessionValid && ownerId === actorId;
}
