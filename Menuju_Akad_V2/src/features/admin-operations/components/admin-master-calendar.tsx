"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { OperationalBadge } from "@/features/vendor-operations/components/operational-feedback";
import { masterCalendar } from "../content/admin-content";
import { calendarExport } from "../domain/admin-review";
import type { AdminRole } from "../types/admin";
const statuses = {
  hold: "Hold sementara",
  review: "Ditinjau",
  confirmed: "Terkonfirmasi",
  blocked: "Tutup untuk baru",
};
export function AdminMasterCalendar({ role }: { role: AdminRole }) {
  const [vendor, setVendor] = useState("");
  const [city, setCity] = useState("Bandung");
  const [start, setStart] = useState("2027-02-14");
  const [end, setEnd] = useState("2027-02-21");
  const [notice, setNotice] = useState("");
  const invalid = start > end || !start || !end;
  const rows = masterCalendar.filter(
    (item) =>
      !invalid &&
      item.date >= start &&
      item.date <= end &&
      (!vendor || item.vendor === vendor) &&
      item.city === city,
  );
  function download() {
    const csv = calendarExport(rows, role);
    if (!csv) {
      setNotice("Scope akses tidak mengizinkan ekspor jadwal lintas vendor.");
      return;
    }
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "jadwal-vendor-terbatas.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Ekspor hanya berisi waktu, vendor, kode pesanan dan lokasi yang diizinkan.");
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Satu agenda lintas mitra.
          </h1>
          <p className="mt-2 text-sm text-secondary">
            14–21 Februari 2027 · zona waktu WIB · hak lihat mengikuti penugasan.
          </p>
        </div>
        <Button
          className="bg-primary"
          disabled={role === "support" || !rows.length}
          onClick={download}
        >
          Ekspor jadwal terbatas
        </Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field
          label="Dari tanggal"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <Field
          label="Sampai tanggal"
          type="date"
          value={end}
          error={invalid ? "Periksa rentang tanggal." : undefined}
          onChange={(e) => setEnd(e.target.value)}
        />
        <Select
          label="Vendor / kategori"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        >
          <option value="">Semua vendor</option>
          {[...new Set(masterCalendar.map((item) => item.vendor))].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </Select>
        <Select label="Kota" value={city} onChange={(e) => setCity(e.target.value)}>
          <option>Bandung</option>
          <option>Jakarta</option>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-card border border-ux-border">
        <table className="w-full min-w-[600px] text-left text-sm">
          <caption className="sr-only">Agenda lintas vendor dalam WIB</caption>
          <thead className="bg-ux-dock text-xs text-secondary">
            <tr>
              {["Tanggal / jam", "Vendor", "Pesanan", "Lokasi", "Status"].map((label) => (
                <th key={label} className="px-5 py-4 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-ux-border">
                <td className="px-5 py-5 font-mono text-xs">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "short",
                    timeZone: "Asia/Jakarta",
                  }).format(new Date(`${row.date}T12:00:00+07:00`))}{" "}
                  · {row.time}
                </td>
                <td className="px-5 py-5">{row.vendor}</td>
                <td className="px-5 py-5">{row.order}</td>
                <td className="px-5 py-5">{row.city}</td>
                <td className="px-5 py-5">
                  <OperationalBadge
                    status={
                      row.status === "confirmed"
                        ? "eligible"
                        : row.status === "blocked"
                          ? "held"
                          : "pending"
                    }
                    label={statuses[row.status]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && (
        <p role="status" className="rounded-control bg-subtle p-6 text-sm">
          Tidak ada agenda pada filter ini.
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-secondary">
          {notice}
        </p>
      )}
      <div className="grid gap-2 border-t border-ux-border pt-5">
        <p className="text-sm font-semibold">Benturan dilihat per tim dan layanan</p>
        <p className="text-sm leading-relaxed text-secondary">
          Hold tidak dihitung sebagai konfirmasi. Blok jadwal tidak membatalkan pesanan. Ekspor
          membatasi data ke waktu, vendor, kode pesanan dan lokasi yang diizinkan.
        </p>
      </div>
    </>
  );
}
