export async function sharePartnerLink(url: string) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Undangan pasangan · Menuju Akad",
        text: "Lengkapi profil dan rencanakan hari istimewa bersama.",
        url,
      });
      return "Tautan undangan siap digunakan pasangan.";
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError")
        return "Tautan undangan siap dibagikan.";
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "Tautan undangan disalin. Kirimkan kepada pasangan.";
  } catch {
    return "Pilih dan salin tautan undangan di atas untuk dibagikan kepada pasangan.";
  }
}
