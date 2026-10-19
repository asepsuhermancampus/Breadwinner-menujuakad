import type { VendorAudit, VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";

type Permission = keyof VendorContext["permissions"];

export function denied(state: VendorWorkspace, errors: Record<string, string>): VendorResult {
  return { ok: false, state, message: Object.values(errors).join(" "), errors };
}

export function guardVendor(
  state: VendorWorkspace,
  context: VendorContext,
  permission: Permission,
  expectedVersion?: number,
): VendorResult | null {
  const errors: Record<string, string> = {};
  if (
    context.role !== "vendor" ||
    context.vendorId !== state.vendorId ||
    context.actorId !== state.ownerId ||
    !context.permissions[permission]
  )
    errors.access = "Izin pemilik vendor diperlukan. Draf tetap dipertahankan.";
  if (!context.sessionValid) errors.session = "Sesi berakhir. Masuk kembali sebelum melanjutkan.";
  if (!context.online) errors.online = "Anda offline. Sambungkan kembali tanpa membuang draf.";
  if (context.availability === "hidden" && !context.sandbox)
    errors.availability = "Vendor masih Hidden. Hanya galeri sandbox internal yang tersedia.";
  if (context.uploadState !== "idle")
    errors.upload =
      context.uploadState === "pending"
        ? "Tunggu pemrosesan dokumen selesai."
        : "Ulangi atau batalkan unggahan yang gagal.";
  if (
    expectedVersion !== undefined &&
    (expectedVersion !== state.version || context.latestVersion !== state.version)
  )
    errors.version = "Versi workspace berubah. Muat ulang lalu tinjau kembali; draf tidak ditimpa.";
  return Object.keys(errors).length ? denied(state, errors) : null;
}

export function replayVendorOperation(
  state: VendorWorkspace,
  operationId: string,
  action: string,
  objectId: string,
): VendorResult | null {
  if (!Object.hasOwn(state.operations, operationId)) return null;
  const previous = state.operations[operationId];
  if (previous?.action !== action || previous.objectId !== objectId)
    return denied(state, { operationId: "Kunci operasi sudah dipakai untuk tindakan lain." });
  return {
    ok: true,
    state,
    message: "Operasi ini sudah diproses. Tidak ada perubahan atau audit ganda.",
  };
}

export function commitVendor(
  state: VendorWorkspace,
  context: VendorContext,
  action: VendorAudit["action"],
  objectId: string,
  reason: string,
  patch: Partial<VendorWorkspace>,
  operationId?: string,
): VendorWorkspace {
  const version = state.version + 1;
  const at = context.now?.() ?? new Date().toISOString();
  const audit: VendorAudit = {
    id: `${state.vendorId}:${version}`,
    action,
    objectId,
    reason,
    actorId: context.actorId,
    vendorId: state.vendorId,
    previousVersion: state.version,
    version,
    at,
  };
  return {
    ...state,
    ...structuredClone(patch),
    version,
    audit: [...state.audit, audit],
    operations: operationId
      ? { ...state.operations, [operationId]: { action, objectId, version } }
      : { ...state.operations },
  };
}
