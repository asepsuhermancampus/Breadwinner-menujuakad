"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Users, CheckCircle2, Clock, XCircle, Crown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import { guestGroupLabel } from "@/features/guest-crm/utils/guest-groups";
import type { SideNames } from "../domain/side-profile-names";
import { defaultSideNames } from "../domain/side-profile-names";

type FilterTab = "all" | "attending" | "pending" | "declined" | "vip";

export function GuestStatusScrollCard({
  guests = [],
  guestsAvailable = true,
  manageHref = "/planner/guests",
  names = defaultSideNames,
  className,
}: {
  guests?: GuestInvitation[] | undefined;
  guestsAvailable?: boolean | undefined;
  manageHref?: string | undefined;
  names?: SideNames | undefined;
  className?: string | undefined;
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const activeGuests = guests.filter((g) => !g.isArchived);

  const attendingGuests = activeGuests.filter((g) => g.rsvpStatus === "ATTENDING");
  const pendingGuests = activeGuests.filter((g) => g.rsvpStatus === "PENDING");
  const declinedGuests = activeGuests.filter((g) => g.rsvpStatus === "DECLINED");
  const vipGuests = activeGuests.filter((g) => g.group === "VIP");

  const filteredGuests =
    activeTab === "attending"
      ? attendingGuests
      : activeTab === "pending"
        ? pendingGuests
        : activeTab === "declined"
          ? declinedGuests
          : activeTab === "vip"
            ? vipGuests
            : activeGuests;

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col shadow-xs", className)}
      aria-label="Detail daftar tamu dan konfirmasi kehadiran"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Users size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">Daftar Tamu & RSVP</h3>
            <p className="text-xs text-secondary truncate">
              {attendingGuests.length} hadir · {pendingGuests.length} menunggu
              {vipGuests.length > 0 && ` (${vipGuests.length} VIP)`}
            </p>
          </div>
        </div>
        {guestsAvailable && (
          <Link
            href={manageHref}
            className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
          >
            Kelola <ArrowUpRight size={13} />
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mt-3 pb-2 border-b border-ux-border/40 text-[11px] overflow-x-auto app-scroll">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-2 py-0.5 rounded transition-all whitespace-nowrap",
            activeTab === "all"
              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
              : "text-secondary hover:text-foreground",
          )}
        >
          Semua ({activeGuests.length})
        </button>
        {attendingGuests.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("attending")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "attending"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-emerald-700/80 hover:text-emerald-800",
            )}
          >
            <CheckCircle2 size={10} /> Hadir ({attendingGuests.length})
          </button>
        )}
        {pendingGuests.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "pending"
                ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                : "text-amber-600/80 hover:text-amber-700",
            )}
          >
            <Clock size={10} /> Menunggu ({pendingGuests.length})
          </button>
        )}
        {declinedGuests.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("declined")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "declined"
                ? "bg-red-500/15 text-red-800 dark:text-red-300 font-semibold"
                : "text-red-600/80 hover:text-red-700",
            )}
          >
            <XCircle size={10} /> Berhalangan ({declinedGuests.length})
          </button>
        )}
        {vipGuests.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("vip")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "vip"
                ? "bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 font-semibold"
                : "text-yellow-700/80 hover:text-yellow-800",
            )}
          >
            <Crown size={10} /> VIP ({vipGuests.length})
          </button>
        )}
      </div>

      {/* Scrollable Guest List */}
      <div className="mt-3 max-h-[320px] sm:max-h-[380px] xl:max-h-[415px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest, idx) => (
            <div
              key={guest.id || `guest-${idx}`}
              className="p-2.5 rounded-lg border border-ux-border/70 bg-subtle/30 flex items-center justify-between gap-2 hover:bg-subtle/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{guest.name}</p>
                <p className="text-[11px] text-secondary truncate">
                  {guestGroupLabel(guest.group, names)} · {guest.quota} Pax
                </p>
              </div>
              <div className="shrink-0">
                {guest.rsvpStatus === "ATTENDING" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={10} /> Hadir ({guest.attendingCount || guest.quota} Pax)
                  </span>
                ) : guest.rsvpStatus === "DECLINED" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/15 text-red-800 dark:text-red-300">
                    <XCircle size={10} /> Berhalangan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300">
                    <Clock size={10} /> Menunggu
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1 my-2">
            <p className="font-semibold text-foreground">
              {activeGuests.length === 0
                ? "Belum ada tamu terdaftar"
                : "Tidak ada tamu pada filter ini"}
            </p>
            <p className="text-secondary text-[11px]">
              {activeGuests.length === 0
                ? "Daftarkan tamu dan kirimkan tautan RSVP di menu Daftar Tamu & RSVP."
                : "Ubah filter di atas untuk melihat tamu lainnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
