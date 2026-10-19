import type { VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { denied, guardVendor } from "./vendor-guards";

export type VendorCalendarState = {
  blocks: { id: string; date: string; reason: string; actorId: string }[];
  operations: Record<string, string>;
};
export type CalendarWorkspace = VendorWorkspace & { calendar?: VendorCalendarState };
export const vendorConfirmedDays = [1, 4, 7, 10, 13, 17, 20, 21, 23, 25, 26, 27];
export function createVendorCalendar(): VendorCalendarState {
  return { blocks: [], operations: {} };
}
export function vendorCalendarDay(state: CalendarWorkspace, date: string) {
  if (state.orders.some((order) => order.status === "accepted" && order.eventDate === date))
    return "confirmed";
  if (date.startsWith("2027-02-") && vendorConfirmedDays.includes(Number(date.slice(-2))))
    return "confirmed";
  if (
    date === "2027-02-14" &&
    state.orders.some((order) => order.id === "ITM-2041" && order.status === "pending")
  )
    return "hold";
  return state.calendar?.blocks.some((block) => block.date === date) ? "blocked" : "available";
}
export function blockVendorDate(
  state: CalendarWorkspace,
  input: {
    date: string;
    reason: string;
    operationId: string;
    expectedVersion: number;
    acknowledged: boolean;
  },
  context: VendorContext,
): VendorResult {
  const guard = guardVendor(state, context, "calendarWrite");
  if (guard) return guard;
  const calendar = state.calendar ?? createVendorCalendar();
  const prior = calendar.operations[input.operationId];
  if (prior)
    return prior === `${input.date}:${input.reason.trim()}`
      ? { ok: true, state, message: "Blok yang sama sudah tersimpan; tidak ada duplikasi." }
      : denied(state, { operationId: "ID operasi sudah digunakan untuk blok lain." });
  const versionGuard = guardVendor(state, context, "calendarWrite", input.expectedVersion);
  if (versionGuard) return versionGuard;
  if (!/^2027-02-(0[1-9]|1\d|2[0-8])$/.test(input.date))
    return denied(state, { date: "Pilih tanggal pada kalender Februari 2027." });
  if (vendorCalendarDay(state, input.date) !== "available")
    return denied(state, {
      date: "Tanggal memiliki pesanan, hold aktif, atau blok. Tidak ada pesanan yang dibatalkan.",
    });
  if (!input.reason.trim() || !input.acknowledged || !input.operationId)
    return denied(state, { reason: "Isi alasan internal dan konfirmasikan blok tanggal." });
  const next: CalendarWorkspace = {
    ...state,
    version: state.version + 1,
    calendar: {
      blocks: [
        ...calendar.blocks,
        {
          id: input.operationId,
          date: input.date,
          reason: input.reason.trim(),
          actorId: context.actorId,
        },
      ],
      operations: {
        ...calendar.operations,
        [input.operationId]: `${input.date}:${input.reason.trim()}`,
      },
    },
  };
  return {
    ok: true,
    state: next,
    message: "Blok internal tersimpan di sandbox. Pesanan terkonfirmasi tidak berubah.",
  };
}
