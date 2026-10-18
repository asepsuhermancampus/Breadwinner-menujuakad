"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { CheckinStaff } from "../types/checkin";

type Props = {
  initialStaff?: CheckinStaff[];
};

export function StaffAccessView({ initialStaff }: Props) {
  const [staffList, setStaffList] = useState<CheckinStaff[]>(
    initialStaff || [
      {
        id: "st-1",
        name: "Dina",
        role: "Petugas Gerbang",
        gate: "Gerbang A",
        schedule: "14 Feb 2027 · 07.00–16.00 WIB",
        status: "Terjadwal",
      },
      {
        id: "st-2",
        name: "Raka",
        role: "Petugas Gerbang",
        gate: "Gerbang B",
        schedule: "14 Feb 2027 · 07.00–16.00 WIB",
        status: "Terjadwal",
      },
      {
        id: "st-3",
        name: "Naya",
        role: "Koordinator Acara",
        gate: "Semua Gerbang",
        schedule: "14 Feb 2027 · 07.00–16.00 WIB",
        status: "Terjadwal",
      },
    ],
  );

  const [revokingId, setRevokingId] = useState<string | null>(null);

  function handleRevoke(id: string) {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Dicabut" } : s)));
    setRevokingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface border border-border rounded-control">
        <h3 className="font-bold text-foreground">Akses Operasional Petugas Check-in</h3>
        <p className="text-xs text-secondary mt-0.5">
          Izin delegasi terbatas untuk hari acara. Petugas tidak memiliki hak ke modul keuangan,
          ekspor data kontak, atau pengeditan kuota.
        </p>
      </div>

      <div className="bg-surface rounded-control border border-border overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-subtle text-secondary font-semibold border-b border-border">
            <tr>
              <th className="p-3">Nama Petugas</th>
              <th className="p-3">Cakupan / Gerbang</th>
              <th className="p-3">Jadwal Tugas</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-b border-border last:border-0">
                <td className="p-3 font-semibold text-foreground">
                  {staff.name}
                  <span className="block text-[11px] font-normal text-secondary">{staff.role}</span>
                </td>
                <td className="p-3">{staff.gate}</td>
                <td className="p-3 font-mono">{staff.schedule}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                      staff.status === "Dicabut"
                        ? "bg-danger-bg text-danger"
                        : "bg-success-bg text-success"
                    }`}
                  >
                    {staff.status}
                  </span>
                </td>
                <td className="p-3">
                  {staff.status !== "Dicabut" ? (
                    revokingId === staff.id ? (
                      <div className="flex gap-1">
                        <Button
                          variant="danger"
                          size="small"
                          className="text-[11px] px-2 py-1"
                          onClick={() => handleRevoke(staff.id)}
                        >
                          Ya, Cabut
                        </Button>
                        <Button
                          variant="secondary"
                          size="small"
                          className="text-[11px] px-2 py-1"
                          onClick={() => setRevokingId(null)}
                        >
                          Batal
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="small"
                        className="text-danger hover:bg-danger-bg text-[11px]"
                        onClick={() => setRevokingId(staff.id)}
                      >
                        Cabut Akses…
                      </Button>
                    )
                  ) : (
                    <span className="text-secondary text-[11px]">Sesi Dihentikan</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-subtle border border-border rounded-control space-y-2 text-xs">
        <div className="font-bold text-foreground">Batas Wewenang Petugas Gerbang:</div>
        <ul className="text-secondary list-disc pl-4 space-y-1">
          <li>Mencari tamu dan memvalidasi tiket masuk pada gerbang yang ditugaskan.</li>
          <li>Mencatat jumlah orang yang tiba sesuai sisa kuota tiket tamu.</li>
          <li>Melihat nomor meja penempatan untuk memandu tamu.</li>
          <li>
            <strong>Dilarang:</strong> Mengubah kuota, mengakses catatan keuangan, atau mengunduh
            basis data tamu.
          </li>
        </ul>
      </div>
    </div>
  );
}
