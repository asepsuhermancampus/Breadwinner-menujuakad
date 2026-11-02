import { Check, QrCode, FileCheck, Wallet, Heart, Users } from "lucide-react";

export function MasterStepOneVisual() {
  return (
    <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <span className="flex size-7 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-800/80 text-[11px] font-bold text-white shadow-xs">
              S
            </span>
            <span className="flex size-7 items-center justify-center rounded-full border border-teal-300/40 bg-teal-800/80 text-[11px] font-bold text-white shadow-xs">
              D
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-white">Sarah & Dimas</span>
            <span className="block text-[10px] text-emerald-200/70">Ruang Privat Terhubung</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time</span>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-emerald-100/75">
        <span className="flex items-center gap-1">
          <Heart size={10} className="text-rose-400" />
          Target Akad
        </span>
        <span className="font-semibold text-emerald-300">14 Februari 2027</span>
      </div>
    </div>
  );
}

export function MasterStepTwoVisual() {
  return (
    <div className="mt-3.5 space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-100/90">
          <FileCheck size={12} className="text-emerald-400" />
          Berkas KUA & Medis
        </span>
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
          8 / 8 Lengkap
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
        <span className="flex items-center gap-1.5 text-[11px] text-emerald-100/90">
          <Wallet size={12} className="text-amber-300" />
          Katering & Vendor
        </span>
        <span className="font-mono text-[11px] font-bold text-amber-200">
          Rp 85 Jt Terkontrol
        </span>
      </div>
    </div>
  );
}

export function MasterStepThreeVisual() {
  return (
    <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-semibold text-white">Undangan Digital Aktif</span>
          <span className="block text-[10px] text-emerald-200/70">450 Tamu Tercatat (92% RSVP)</span>
        </div>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
          <QrCode size={14} />
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-emerald-100/75">
        <span className="flex items-center gap-1">
          <Users size={10} className="text-emerald-400" />
          Buku Tamu Resepsi
        </span>
        <span className="font-semibold text-emerald-300">Scan QR Siaga</span>
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
    <div className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition">
      <div>
        {/* Header Nomor & Kategori */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-serif text-2xl font-light text-emerald-300">{num}</span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-200 uppercase">
            {category}
          </span>
        </div>

        {/* Judul & Narasi Ringkas */}
        <div className="mt-3.5 text-left">
          <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">{desc}</p>
        </div>

        {/* Visual Mini Kompak */}
        {visual}
      </div>

      {/* Chips Tag Ringkas */}
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-emerald-100/90"
          >
            <Check size={10} className="text-emerald-300" aria-hidden="true" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
