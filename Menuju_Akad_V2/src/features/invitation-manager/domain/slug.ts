export type SlugCheckResult =
  | { status: "AVAILABLE"; slug: string }
  | { status: "TAKEN"; slug: string }
  | { status: "INVALID"; slug: string; reason: string };

// Deterministic sandbox registry per Batch 05 contract frame 54:
// a taken slug never reveals its owner; the active couple slug cannot be reused for a draft.
const takenSlugs = new Set(["andi-risa-story", "andi", "risa", "menuju-akad"]);

export function checkSlug(raw: string): SlugCheckResult {
  const slug = raw.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,48})?[a-z0-9]$/.test(slug) || slug.length < 2) {
    return {
      status: "INVALID",
      slug,
      reason: "Gunakan 2–50 karakter huruf, angka, dan tanda hubung.",
    };
  }
  if (slug === "andi-risa") {
    return {
      status: "INVALID",
      slug,
      reason: "Ini alamat aktif Anda sendiri. Pilih slug lain untuk draf.",
    };
  }
  if (takenSlugs.has(slug)) {
    return { status: "TAKEN", slug };
  }
  return { status: "AVAILABLE", slug };
}

export const slugSuggestion = "andi-risa-14feb2027";
export const activeInvitationUrl = "menujuakad.id/andi-risa";
