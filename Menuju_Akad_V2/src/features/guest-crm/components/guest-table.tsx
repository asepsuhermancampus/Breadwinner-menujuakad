"use client";

import { useState } from "react";
import { useCustomerNames } from "@/features/customer-workspace/components/customer-names-context";
import { guestGroupLabel, guestGroups } from "../utils/guest-groups";
import type { GuestInvitation } from "../types/guest";
import { filterGuests } from "../utils/guest-filter";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import styles from "./guest-crm.module.css";

type Props = {
  guests: GuestInvitation[];
  onSelectGuest: (guest: GuestInvitation) => void;
  onOpenCreate: () => void;
  onOpenImport: () => void;
};

export function GuestTable({ guests, onSelectGuest, onOpenCreate, onOpenImport }: Props) {
  const names = useCustomerNames();
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("Semua grup");
  const [rsvpFilter, setRsvpFilter] = useState("Semua RSVP");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = filterGuests(guests, query, groupFilter, rsvpFilter, names);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const effectivePage = Math.min(Math.max(1, page), totalPages);
  const currentRows = filtered.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader}>
        <div className={styles.filterGroup}>
          <input
            type="search"
            placeholder="Cari nama, grup, atau nomor…"
            aria-label="Cari nama, grup, atau nomor"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="rounded-control border border-border bg-canvas px-3 py-2 text-sm text-foreground focus:outline-primary min-w-[240px]"
          />
          <select
            value={groupFilter}
            onChange={(e) => {
              setGroupFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter berdasarkan grup"
            className="rounded-control border border-border bg-canvas px-3 py-2 text-sm text-foreground"
          >
            <option>Semua grup</option>
            {guestGroups.map((value) => (
              <option key={value} value={value}>
                {guestGroupLabel(value, names)}
              </option>
            ))}
          </select>
          <select
            value={rsvpFilter}
            onChange={(e) => {
              setRsvpFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter berdasarkan RSVP"
            className="rounded-control border border-border bg-canvas px-3 py-2 text-sm text-foreground"
          >
            <option>Semua RSVP</option>
            <option>Hadir</option>
            <option>Tidak Hadir</option>
            <option>Belum Menjawab</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onOpenImport}>
            Impor CSV
          </Button>
          <Button variant="primary" onClick={onOpenCreate}>
            + Tambah Undangan
          </Button>
        </div>
      </div>

      <div className="app-scroll overflow-x-auto">
        <table className={styles.tableContent}>
          <thead>
            <tr>
              <th>Nama & kontak</th>
              <th>Grup</th>
              <th>Kuota</th>
              <th>RSVP</th>
              <th>Hadir</th>
              <th>WhatsApp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-secondary">
                  Belum ada data undangan yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              currentRows.map((g) => (
                <tr
                  key={g.id}
                  className={styles.tableRow}
                  onClick={() => onSelectGuest(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onSelectGuest(g)}
                >
                  <td>
                    <div className="font-semibold text-foreground">{g.name}</div>
                    <div className="text-xs text-secondary">{g.contactPhone || "Tanpa nomor"}</div>
                  </td>
                  <td>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-subtle">
                      {guestGroupLabel(g.group, names)}
                    </span>
                  </td>
                  <td className="font-mono text-sm">{g.quota} pax</td>
                  <td>
                    {g.rsvpStatus === "ATTENDING" && <Status tone="success">Hadir</Status>}
                    {g.rsvpStatus === "DECLINED" && <Status tone="danger">Berhalangan</Status>}
                    {g.rsvpStatus === "PENDING" && <Status tone="info">Belum Jawab</Status>}
                  </td>
                  <td className="font-mono text-sm">
                    {g.rsvpStatus === "ATTENDING" ? `${g.attendingCount} orang` : "0"}
                  </td>
                  <td>
                    {g.waConsent ? (
                      <span className="text-xs text-success font-medium">✓ Berizin</span>
                    ) : (
                      <span className="text-xs text-secondary">Tanpa Izin</span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGuest(g);
                      }}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-secondary">
        <div>
          Menampilkan {filtered.length === 0 ? 0 : (effectivePage - 1) * pageSize + 1}–
          {Math.min(effectivePage * pageSize, filtered.length)} dari {filtered.length} undangan
        </div>
        {totalPages > 1 && (
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="small"
              disabled={effectivePage <= 1}
              onClick={() => setPage(effectivePage - 1)}
            >
              Sebelumnya
            </Button>
            <span className="px-2 py-1 flex items-center font-mono">
              {effectivePage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="small"
              disabled={effectivePage >= totalPages}
              onClick={() => setPage(effectivePage + 1)}
            >
              Berikutnya
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
