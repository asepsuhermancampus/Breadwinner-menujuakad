import { Check, QrCode, FileCheck, Wallet, Heart, CalendarCheck } from "lucide-react";

export function MasterStepOneVisual() {
  return (
    <div className="my-4 rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-inner backdrop-blur-xs">
      {/* Profil Pasangan Terhubung */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex -space-x-2">
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-brand-secondary bg-rose-500/25 text-xs font-bold text-rose-200">
              S
            </span>
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-brand-secondary bg-emerald-500/25 text-xs font-bold text-emerald-200">
              D
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-white">
              <span>Sarah & Dimas</span>
              <Heart size={11} className="fill-rose-400 text-rose-400" />
            </div>
            <span className="text-[10px] text-emerald-200/70">Ruang Perencanaan Berdua</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Terhubung</span>
        </div>
      </div>

      {/* Target Hari H */}
      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-100/80">
          <CalendarCheck size={13} className="text-emerald-300" />
          <span>Target Akad</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-white">14 Februari 2027</span>
          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-medium text-emerald-200">H-48</span>
        </div>
      </div>
    </div>
  );
}

export function MasterStepTwoVisual() {
  return (
    <div className="my-4 rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-inner backdrop-blur-xs space-y-2.5">
      {/* Modul Berkas */}
      <div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100">
            <FileCheck size={13} className="text-emerald-400" />
            Legalitas KUA Kemenag
          </span>
          <span className="rounded-md border border-emerald-400/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
            8/8 Siap
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Modul Anggaran */}
      <div className="border-t border-white/10 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-100">
            <Wallet size={13} className="text-amber-300" />
            Pos Katering & Vendor
          </span>
          <span className="font-mono text-xs font-bold text-amber-200">
            Rp 85.000.000
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-3/4 rounded-full bg-amber-400" />
        </div>
      </div>
    </div>
  );
}

export function MasterStepThreeVisual() {
  return (
    <div className="my-4 rounded-2xl border border-white/15 bg-black/35 p-3.5 shadow-inner backdrop-blur-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="block truncate text-xs font-bold text-white">Undangan Editorial</span>
            <span className="rounded bg-teal-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-teal-200">Aktif</span>
          </div>
          <span className="mt-0.5 block text-[10px] text-emerald-200/70">450 Tamu Terdata · 92% RSVP</span>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-100/80">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Meja Tamu: Scan QR Siaga</span>
          </div>
        </div>

        {/* QR Code Badge */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-amber-300/40 bg-amber-400/15 text-amber-200 shadow-sm">
          <QrCode size={22} />
        </div>
      </div>
    </div>
  );
}

export interface MasterStepCardProps {
  num: string;
  category: string;
  title: string;
  desc: string;
  chips: string[];
  visual: React.ReactNode;
}

export function MasterStepCard({
  num,
  category,
  title,
  desc,
  chips,
  visual,
}: MasterStepCardProps) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 shadow-lg backdrop-blur-md transition hover:border-white/25 sm:p-6">
      {/* Soft Glow Pojok */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-36 rounded-full bg-emerald-400/10 blur-xl" />

      <div className="relative z-10">
        {/* Header Nomor & Kategori */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-serif text-3xl font-light text-emerald-300">{num}</span>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
            {category}
          </span>
        </div>

        {/* Judul & Deskripsi */}
        <div className="mt-4 text-left">
          <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">{desc}</p>
        </div>

        {/* Mockup Visual */}
        {visual}
      </div>

      {/* Feature Chips */}
      <div className="relative z-10 mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-emerald-100"
          >
            <Check size={11} className="text-emerald-300" aria-hidden="true" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
