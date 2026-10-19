import { accepted, blocked, guardOperation } from "./guards";
import type { GateContext, NotificationLog } from "../types/operations";

export function retryNotification(input: {
  log: NotificationLog;
  context: GateContext;
  now: number;
  dispatchedKeys: string[];
  reason: string;
  acknowledged: boolean;
}) {
  const { log, context, now, dispatchedKeys, reason, acknowledged } = input;
  const gate = guardOperation({
    ...context,
    action: "notifications.dispatch",
    version: log.version,
  });
  if (!gate.ok) return { ...gate, log, dispatchedKeys };
  if (!log.templateValid)
    return {
      ...blocked("Template tidak lagi sah. Review template sebelum mengirim."),
      log,
      dispatchedKeys,
    };
  if (!log.consent)
    return {
      ...blocked("Izin penerima telah dicabut. Pengiriman dibatalkan."),
      log: { ...log, status: "canceled" as const },
      dispatchedKeys,
    };
  if (log.status !== "failed")
    return {
      ...blocked(
        "Hanya kegagalan definitif dapat diulang. Periksa status provider untuk hasil ambigu.",
      ),
      log,
      dispatchedKeys,
    };
  if (now < log.cooldownUntil)
    return {
      ...blocked("Cooldown belum selesai. Tunggu sebelum menjadwalkan ulang."),
      log,
      dispatchedKeys,
    };
  if (dispatchedKeys.includes(log.campaignKey))
    return {
      ...blocked("Pesan sudah dijadwalkan untuk kampanye ini. Duplikat dicegah."),
      log,
      dispatchedKeys,
    };
  if (reason.trim().length < 8 || !acknowledged)
    return {
      ...blocked("Isi alasan dan konfirmasi pemeriksaan penerima terbaru."),
      log,
      dispatchedKeys,
    };
  return {
    ...accepted("Satu pesan dijadwalkan ulang dalam simulasi. Belum terkirim."),
    log: {
      ...log,
      status: "queued" as const,
      reason: "Retry terjadwal · menunggu worker",
      version: log.version + 1,
    },
    dispatchedKeys: [...dispatchedKeys, log.campaignKey],
  };
}
export function inspectSameProvider(log: NotificationLog, context: GateContext) {
  const gate = guardOperation({ ...context, action: "notifications.read", version: log.version });
  if (!gate.ok || log.status !== "unknown") return { ...gate, log };
  return {
    ...accepted(
      "Provider diperiksa dengan ID N-2043 yang sama: delivered pada fixture. Tidak ada pengiriman baru.",
    ),
    log: {
      ...log,
      status: "delivered" as const,
      reason: "Dikonfirmasi provider · tanpa retry",
      version: log.version + 1,
    },
  };
}
