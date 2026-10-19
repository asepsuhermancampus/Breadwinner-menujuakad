import type {
  BankRevisionDraft,
  CatalogDraft,
  PrivateEvidence,
  UploadMetadata,
} from "../types/vendor";

const safeImage = (src: string) =>
  /^\/assets\/(?:[a-z\d_-]+\/)*[a-z\d_.-]+\.(?:png|jpe?g|webp|avif)$/i.test(src) ||
  /^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/]+={0,2}$/i.test(src);

export function validateVendorCatalog(draft: CatalogDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of ["name", "ownerName", "category", "city", "address", "description"] as const)
    if (!draft.profile[field].trim())
      errors[`profile.${field}`] = "Lengkapi informasi profil usaha.";
  if (!draft.profile.pinSet) errors["profile.pinSet"] = "Tetapkan pin lokasi usaha.";
  if (!safeImage(draft.profile.cover))
    errors["profile.cover"] = "Pilih gambar raster lokal yang valid.";
  if (!draft.packages.length) errors.packages = "Sediakan setidaknya satu paket usaha.";
  if (new Set(draft.packages.map((item) => item.id)).size !== draft.packages.length)
    errors.packages = "ID setiap paket harus berbeda.";
  for (const item of draft.packages) {
    const key = `packages.${item.id}`;
    if (!item.id.trim() || !item.name.trim() || !item.description.trim() || !item.duration.trim())
      errors[key] = "Lengkapi nama, deskripsi, dan durasi paket.";
    if (!Number.isSafeInteger(item.priceIdr) || item.priceIdr <= 0)
      errors[`${key}.priceIdr`] = "Harga harus berupa rupiah bulat lebih dari nol.";
    if (!item.deliverables.length || item.deliverables.some((entry) => !entry.trim()))
      errors[`${key}.deliverables`] = "Lengkapi hasil layanan yang diterima pasangan.";
    if (!safeImage(item.image)) errors[`${key}.image`] = "Pilih gambar paket yang valid.";
  }
  return errors;
}

export const normalizeAccountNumber = (value: string) => value.replace(/[\s-]/g, "");
const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");

export function validatePrivateFile(file: UploadMetadata | null): string {
  if (!file) return "Unggah bukti kepemilikan rekening baru yang utuh.";
  const extension = file.name.split(".").at(-1)?.toLowerCase();
  const mime: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  if (!extension || mime[extension] !== file.type || /[\\/]/.test(file.name))
    return "Dokumen harus PDF, JPG, atau PNG dengan ekstensi dan tipe yang sesuai.";
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > 10 * 1024 * 1024)
    return "Ukuran dokumen harus lebih dari 0 dan maksimal 10 MB.";
  return "";
}

export function validateBankRevision(draft: BankRevisionDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.bankName.trim()) errors.bankName = "Pilih bank tujuan.";
  if (!draft.accountName.trim()) errors.accountName = "Masukkan nama pemilik rekening.";
  const number = normalizeAccountNumber(draft.accountNumber);
  if (!/^\d{8,20}$/.test(number))
    errors.accountNumber = "Masukkan nomor rekening lengkap, 8–20 digit.";
  if (
    !draft.confirmAccountName.trim() ||
    normalizeName(draft.confirmAccountName) !== normalizeName(draft.accountName)
  )
    errors.confirmAccountName = "Konfirmasi nama harus sama dengan nama pemilik rekening.";
  if (normalizeAccountNumber(draft.confirmAccountNumber) !== number)
    errors.confirmAccountNumber = "Konfirmasi nomor rekening harus sama.";
  const documentError = validatePrivateFile(draft.document);
  if (documentError) errors.document = documentError;
  if (!draft.acknowledged)
    errors.acknowledged = "Tinjau nama dan nomor rekening, lalu beri persetujuan.";
  if (!draft.operationId.trim()) errors.operationId = "Kunci pengajuan diperlukan.";
  return errors;
}

export function privateEvidence(file: UploadMetadata, operationId: string): PrivateEvidence {
  return {
    id: `private:${operationId}`,
    label: "Bukti kepemilikan rekening",
    extension: file.name.split(".").at(-1)!.toLowerCase() as PrivateEvidence["extension"],
    mimeType: file.type,
    sizeBytes: file.size,
    access: "private",
  };
}
