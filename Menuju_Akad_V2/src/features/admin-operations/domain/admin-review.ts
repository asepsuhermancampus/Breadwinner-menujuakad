import type {
  AdminRole,
  CalendarRecord,
  ReviewContext,
  ReviewDecision,
  ReviewState,
} from "../types/admin";
export function reviewAdminItem(state: ReviewState, input: ReviewDecision, context: ReviewContext) {
  const fail = (message: string) => ({ ok: false, state, message });
  if (!context.online) return fail("Hentikan pengiriman saat offline. Draf alasan tetap tersedia.");
  if (!context.sessionValid || !context.canReview || context.role !== "superadmin")
    return fail("Izin pemeriksa tidak tersedia. Tidak ada keputusan disimpan.");
  const previous = state.audit.find((entry) => entry.id === input.operationId);
  if (previous)
    return previous.objectId === input.id && previous.action === input.action
      ? { ok: true, state, message: "Keputusan ini sudah tercatat, tanpa duplikasi." }
      : fail("Kunci operasi telah dipakai untuk keputusan berbeda.");
  const item = state[input.kind].find((entry) => entry.id === input.id);
  if (!item || item.version !== input.expectedVersion)
    return fail("Versi berubah saat review. Muat snapshot terbaru dan tinjau ulang.");
  if (!input.acknowledged || input.reason.trim().length < 10)
    return fail(
      "Tinjau snapshot, isi alasan minimal 10 karakter dan berikan persetujuan eksplisit.",
    );
  if (
    input.kind === "kyb" &&
    (input.action === "false-positive" || (input.action === "approved" && !item.proofComplete))
  )
    return fail("Persetujuan diblokir sampai berkas dan kecocokan identitas lolos.");
  if (!["pending", "revision-required"].includes(item.status))
    return fail("Item ini sudah diputuskan; keputusan baru memerlukan versi baru.");
  return {
    ok: true,
    message: "Keputusan dan snapshot dicatat pada audit simulasi lokal.",
    state: {
      ...state,
      [input.kind]: state[input.kind].map((entry) =>
        entry.id === item.id ? { ...entry, status: input.action } : entry,
      ),
      audit: [
        ...state.audit,
        {
          id: input.operationId,
          objectId: item.id,
          actor: context.actor,
          reason: input.reason.trim(),
          version: item.version,
          action: input.action,
          at: context.now?.() ?? new Date().toISOString(),
        },
      ],
    },
  };
}
const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
export function calendarExport(rows: CalendarRecord[], role: AdminRole) {
  if (role === "support") return null;
  return [
    "date,time,vendor,order,city,status",
    ...rows.map((row) =>
      [
        row.date,
        row.time,
        row.vendor,
        row.order.startsWith("ORD-") ? row.order : "",
        row.city,
        row.status,
      ]
        .map(cell)
        .join(","),
    ),
  ].join("\r\n");
}
