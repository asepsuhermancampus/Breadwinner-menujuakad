/**
 * Menghasilkan salam berdasarkan waktu lokal Indonesia (Asia/Jakarta).
 *
 * Rentang waktu:
 * - 04:00 - 10:59: "Selamat pagi"
 * - 11:00 - 14:59: "Selamat siang"
 * - 15:00 - 18:29: "Selamat sore"
 * - 18:30 - 03:59: "Selamat malam"
 */
export function getTimeGreeting(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? date.getHours());
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? date.getMinutes());
  const time = hour + minute / 60;

  if (time >= 4 && time < 11) {
    return "Selamat pagi";
  }
  if (time >= 11 && time < 15) {
    return "Selamat siang";
  }
  if (time >= 15 && time < 18.5) {
    return "Selamat sore";
  }
  return "Selamat malam";
}

