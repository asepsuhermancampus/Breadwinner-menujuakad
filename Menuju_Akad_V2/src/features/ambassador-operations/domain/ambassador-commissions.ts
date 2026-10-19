import type {
  AmbassadorContext,
  AmbassadorResult,
  AmbassadorState,
  Commission,
} from "../types/ambassador";

export function ambassadorBalances(state: AmbassadorState) {
  const availableIdr = state.commissions
    .filter((item) => item.status === "available")
    .reduce((sum, item) => sum + item.amountIdr, 0);
  const pendingIdr = state.commissions
    .filter((item) => item.status !== "available")
    .reduce((sum, item) => sum + item.amountIdr, 0);
  const heldIdr = state.withdrawals.reduce((sum, item) => sum + item.amountIdr, 0);
  return { availableIdr: availableIdr - heldIdr, pendingIdr, heldIdr };
}
export function ambassadorDenied(
  state: AmbassadorState,
  key: string,
  message: string,
): AmbassadorResult {
  return { ok: false, state, message, errors: { [key]: message } };
}
export function guardAmbassador(
  state: AmbassadorState,
  context: AmbassadorContext,
  permission: keyof AmbassadorContext["permissions"],
  expectedVersion?: number,
): AmbassadorResult | null {
  if (
    context.role !== "ambassador" ||
    context.ownerId !== state.ownerId ||
    context.actorId !== state.ownerId ||
    !context.permissions[permission]
  )
    return ambassadorDenied(
      state,
      "access",
      "Izin pemilik Brand Ambassador diperlukan. Histori tidak dihapus.",
    );
  if (!context.sessionValid)
    return ambassadorDenied(state, "session", "Sesi berakhir. Masuk kembali sebelum melanjutkan.");
  if (!context.online)
    return ambassadorDenied(
      state,
      "online",
      "Anda offline. Data dan draf tetap tersedia; belum ada pengajuan baru.",
    );
  if (!context.sandbox && context.availability === "hidden")
    return ambassadorDenied(
      state,
      "availability",
      "Brand Ambassador masih Hidden. Entry point produksi tetap dibatasi.",
    );
  if (
    expectedVersion !== undefined &&
    (expectedVersion !== state.version || context.latestVersion !== state.version)
  )
    return ambassadorDenied(
      state,
      "version",
      "Versi komisi berubah. Muat ulang dan tinjau kembali sebelum melanjutkan.",
    );
  return null;
}
export function updateVendorAttribution(
  state: AmbassadorState,
  input: {
    sourceId: string;
    eligibleFeeIdr: number;
    sourceVersion: number;
    status: Commission["status"];
    expectedVersion: number;
  },
  context: AmbassadorContext,
): AmbassadorResult {
  const guard = guardAmbassador(state, context, "attributionWrite", input.expectedVersion);
  if (guard) return guard;
  const prior = state.commissions.find((item) => item.sourceId === input.sourceId);
  if (prior && prior.program !== "vendor")
    return ambassadorDenied(
      state,
      "basis",
      "Atribusi vendor tidak dapat menulis saldo historis atau program pasangan.",
    );
  if (prior && input.sourceVersion <= prior.version)
    return {
      ok: true,
      state,
      message: "Atribusi duplikat atau lama diabaikan. Tidak ada komisi tambahan.",
    };
  if (
    !input.sourceId.trim() ||
    !Number.isSafeInteger(input.eligibleFeeIdr) ||
    input.eligibleFeeIdr < 0 ||
    !Number.isSafeInteger(input.sourceVersion) ||
    input.sourceVersion <= 0
  )
    return ambassadorDenied(
      state,
      "basis",
      "Fee layak dan versi sumber harus valid. Pendaftaran saja tidak menghasilkan komisi.",
    );
  const amountIdr = Number((BigInt(input.eligibleFeeIdr) * 1500n) / 10_000n);
  const commission: Commission = {
    id: prior?.id ?? `COM-V${state.commissions.length + 1}`,
    sourceId: input.sourceId,
    date: "25 Okt",
    label: prior?.label ?? `Atribusi ${input.sourceId}`,
    program: "vendor",
    amountIdr,
    eligibleFeeIdr: input.eligibleFeeIdr,
    status: input.status,
    version: input.sourceVersion,
  };
  const version = state.version + 1;
  return {
    ok: true,
    state: {
      ...state,
      version,
      commissions: prior
        ? state.commissions.map((item) => (item.sourceId === input.sourceId ? commission : item))
        : [...state.commissions, commission],
      audit: [
        ...state.audit,
        {
          id: `BA-${version}`,
          actorId: context.actorId,
          action: "commission.recalculated",
          reference: commission.sourceId,
          version,
        },
      ],
    },
    message:
      "Komisi dihitung ulang dari fee platform layak. Koreksi/refund mengganti referensi yang sama.",
  };
}
