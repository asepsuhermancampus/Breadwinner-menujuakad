export const MAX_KUA_FILE_SIZE = 5 * 1024 * 1024;

export type KuaValidationResult =
  { valid: true; error?: undefined } | { valid: false; error: string };

export function validateKuaFile(file: File | null | undefined): KuaValidationResult {
  if (!file) {
    return { valid: false, error: "Pilih berkas terlebih dahulu." };
  }

  if (file.size <= 0) {
    return { valid: false, error: "Berkas tidak boleh kosong (0 byte)." };
  }

  if (file.size > MAX_KUA_FILE_SIZE) {
    return { valid: false, error: "Ukuran berkas melebihi batas maksimal 5MB." };
  }

  const name = file.name.trim();
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1 || lastDot === name.length - 1) {
    return {
      valid: false,
      error: "Format berkas tidak didukung. Pilih berkas PDF, JPG, atau PNG yang valid.",
    };
  }

  const ext = name.slice(lastDot).toLowerCase();
  const mime = file.type.toLowerCase();

  const isPdf = mime === "application/pdf" && ext === ".pdf";
  const isJpeg = mime === "image/jpeg" && (ext === ".jpg" || ext === ".jpeg");
  const isPng = mime === "image/png" && ext === ".png";

  if (!isPdf && !isJpeg && !isPng) {
    return {
      valid: false,
      error: "Format berkas tidak didukung. Pilih berkas PDF, JPG, atau PNG yang valid.",
    };
  }

  return { valid: true };
}
