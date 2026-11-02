import { Heart, Check, QrCode, TrendingUp } from "lucide-react";

export function StepOneVisual() {
  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/20 font-serif text-xs font-bold text-emerald-200 ring-1 ring-emerald-400/30">
            D
          </div>
          <div className="flex items-center gap-1">
            <div className="h-px w-4 bg-gradient-to-r from-emerald-400/40 to-amber-300/60" />
            <div className="flex size-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40">
              <Heart size={10} className="fill-amber-300" />
            </div>
            <div className="h-px w-4 bg-gradient-to-r from-amber-300/60 to-emerald-400/40" />
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/20 font-serif text-xs font-bold text-amber-200 ring-1 ring-amber-400/30">
            S
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Terhubung
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[11px] text-emerald-100/80">
        <span className="truncate">Ruang privat Sarah & Dimas</span>
        <span className="font-medium text-emerald-300">1 Dasbor</span>
      </div>
    </div>
  );
}

export function StepTwoVisual() {
  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/70">Estimasi Anggaran</span>
        <span className="inline-flex items-center gap-1 font-mono font-semibold text-emerald-200">
          <TrendingUp size={12} className="text-emerald-300" />
          Rp 85 Jt
        </span>
      </div>

      <div className="mt-2.5">
        <div className="flex justify-between text-[10px] text-white/60">
          <span>78% Teralokasi</span>
          <span>Target Terkendali</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300"
            style={{ width: "78%" }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[11px] text-emerald-100/80">
        <span>18 Vendor Terpilih</span>
        <span className="font-medium text-emerald-300">450 Tamu</span>
      </div>
    </div>
  );
}

export function StepThreeVisual() {
  return (
    <div className="relative mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div>
          <span className="block font-serif text-xs italic text-emerald-200">
            Dimas & Sarah
          </span>
          <span className="text-[10px] tracking-wider text-white/60 uppercase">
            Editorial Luxury
          </span>
        </div>
        <div className="flex size-8 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
          <QrCode size={16} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-emerald-100/80">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          RSVP Konfirmasi
        </span>
        <span className="font-mono font-medium text-emerald-300">92% Hadir</span>
      </div>
    </div>
  );
}

export interface StepCardProps {
  num: string;
  category: string;
  title: string;
  desc: string;
  chips: string[];
  visual: React.ReactNode;
}

export function StepCard({ num, category, title, desc, chips, visual }: StepCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300/40 hover:bg-white/[0.07] hover:shadow-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-400/5 blur-2xl transition-all group-hover:bg-emerald-400/10" />

      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-serif text-3xl font-light tracking-tight text-emerald-300">
            {num}
          </span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-0.5 text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
            {category}
          </span>
        </div>

        <div className="mt-5">
          <h3 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-emerald-100/75 sm:text-sm">
            {desc}
          </p>
        </div>

        {visual}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-emerald-100/90"
          >
            <Check size={11} className="text-emerald-300" aria-hidden="true" />
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

