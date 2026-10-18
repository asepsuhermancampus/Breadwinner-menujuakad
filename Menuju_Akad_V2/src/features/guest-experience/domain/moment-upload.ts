export function validateMomentUpload(
  file: { type: string; size: number },
  consent: boolean,
): { ok: true } | { ok: false; error: string } {
  if (!["image/jpeg", "image/png"].includes(file.type))
    return { ok: false, error: "Pilih berkas JPG atau PNG." };
  if (file.size <= 0 || file.size > 10 * 1024 * 1024)
    return { ok: false, error: "Ukuran foto harus lebih dari 0 dan maksimal 10 MB." };
  if (!consent)
    return { ok: false, error: "Persetujuan pemilik dan orang dalam foto wajib diberikan." };
  return { ok: true };
}
