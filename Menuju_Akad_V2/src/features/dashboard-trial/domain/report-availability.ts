import { planningAvailability, taskAvailability } from "./task-availability";
export async function readTrialReportAvailability() {
  const [
    pdf,
    tasks,
    emergency,
    calendar,
    documents,
    rundown,
    guests,
    finance,
    seserahan,
    catering,
  ] = await Promise.all([
    planningAvailability("pdf"),
    taskAvailability(),
    planningAvailability("emergency"),
    planningAvailability("calendar"),
    planningAvailability("documents"),
    planningAvailability("rundown"),
    planningAvailability("guests"),
    planningAvailability("finance"),
    planningAvailability("seserahan"),
    planningAvailability("catering"),
  ]);
  if (pdf !== "active")
    return {
      error:
        pdf === "maintenance"
          ? "Ringkasan cetak sedang dalam pemeliharaan."
          : pdf === "disabled"
            ? "Ringkasan cetak belum tersedia untuk pengguna percobaan."
            : "Status ringkasan belum dapat diperiksa. Periksa koneksi dan coba lagi.",
    };
  const checks = [
    [tasks, "tugas"],
    [emergency, "perlengkapan darurat"],
    [calendar, "kalender"],
    [documents, "dokumen"],
    [rundown, "rundown"],
    [guests, "tamu"],
    [finance, "keuangan"],
    [seserahan, "seserahan"],
    [catering, "katering"],
  ] as const;
  const unavailable = checks.find(([status]) => status === "unavailable");
  if (unavailable)
    return {
      error: `Status ${unavailable[1]} belum dapat diperiksa. Periksa koneksi dan coba lagi.`,
    };
  return {
    tasks: tasks !== "disabled",
    emergency: emergency !== "disabled",
    calendar: calendar !== "disabled",
    documents: documents !== "disabled",
    rundown: rundown !== "disabled",
    guests: guests !== "disabled",
    finance: finance !== "disabled",
    seserahan: seserahan !== "disabled",
    catering: catering !== "disabled",
  };
}
