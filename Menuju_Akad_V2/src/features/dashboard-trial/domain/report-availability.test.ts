import { expect, it, vi } from "vitest";
import { readTrialReportAvailability } from "./report-availability";
vi.mock("./task-availability", () => ({
  taskAvailability: vi.fn(),
  planningAvailability: vi.fn(),
}));
import { taskAvailability, planningAvailability } from "./task-availability";
it("fails closed if a required status cannot be checked", async () => {
  vi.mocked(taskAvailability).mockResolvedValue("active");
  vi.mocked(planningAvailability).mockImplementation(async (feature) =>
    feature === "calendar" ? "unavailable" : "active",
  );
  expect(await readTrialReportAvailability()).toEqual({
    error: "Status kalender belum dapat diperiksa. Periksa koneksi dan coba lagi.",
  });
});
it("reports that printing is unavailable to the audience", async () => {
  vi.mocked(taskAvailability).mockResolvedValue("active");
  vi.mocked(planningAvailability).mockImplementation(async (feature) =>
    feature === "pdf" ? "disabled" : "active",
  );
  expect(await readTrialReportAvailability()).toEqual({
    error: "Ringkasan cetak belum tersedia untuk pengguna percobaan.",
  });
});
it("excludes disabled features while allowing maintained data to remain in the report", async () => {
  vi.mocked(taskAvailability).mockResolvedValue("disabled");
  vi.mocked(planningAvailability).mockImplementation(async (feature) =>
    feature === "documents" ? "disabled" : feature === "emergency" ? "maintenance" : "active",
  );
  expect(await readTrialReportAvailability()).toEqual({
    tasks: false,
    emergency: true,
    calendar: true,
    documents: false,
    rundown: true,
    guests: true,
    finance: true,
    seserahan: true,
    catering: true,
  });
});
