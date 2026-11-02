import { Check, QrCode, FileText, Utensils, CheckCircle2, Heart } from "lucide-react";

export function MasterStepOneVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-white">Ruang Privat Berdua</span>
        </div>
        <span className="text-[10px] font-medium text-emerald-200">
          Akun Terhubung
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-left">
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
          <span className="block text-[10px] text-emerald-200/70">Mempelai Wanita</span>
          <span className="text-xs font-bold text-white">Sarah</span>
          <span className="block text-[9px] text-white/50">Pembuat Ruang</span>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <span className="block text-[10px] text-amber-200/70">Mempelai Pria</span>
            <Heart size={10} className="fill-amber-300 text-amber-300" />
          </div>
          <span className="text-xs font-bold text-white">Dimas</span>
          <span className="block text-[9px] text-white/50">Partner Terverifikasi</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-emerald-100/80">
        <span>Target Hari H</span>
        <span className="font-semibold text-emerald-300">14 Februari 2027</span>
      </div>
    </div>
  );
}

export function MasterStepTwoVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-white">
          <FileText size={13} className="text-emerald-300" />
          <span className="font-semibold">Syarat KUA & Anggaran</span>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-200">Rp 85 Jt</span>
      </div>

      <div className="mt-3 space-y-2 text-left">
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-100">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Formulir N1, N2, N4 & Medis
          </span>
          <span className="text-[10px] font-medium text-emerald-300">8/8 Siap</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-100">
            <Utensils size={12} className="text-amber-300" />
            Katering 300 Undangan
          </span>
          <span className="text-[10px] text-amber-200 font-medium">600 Pax Buffet</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] text-emerald-100/80">
        <span>Alokasi Finansial</span>
        <span className="font-semibold text-emerald-300">Terkontrol 100%</span>
      </div>
    </div>
  );
}

export function MasterStepThreeVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="block font-serif text-xs italic text-emerald-200">Sarah & Dimas</span>
          <span className="text-[10px] text-white/60">Tema Editorial Light</span>
        </div>
        <div className="flex size-7 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
          <QrCode size={14} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-100/80">
        <span>Daftar Tamu Tercatat</span>
        <span className="font-mono font-bold text-white">450 Tamu</span>
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-emerald-100/80">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          RSVP Konfirmasi
        </span>
        <span className="font-semibold text-emerald-300">92% Hadir</span>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-white/50">
        <span>Meja Penerima Tamu</span>
        <span className="text-emerald-300">Scan QR Siaga</span>
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
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:p-7 backdrop-blur-md">
      <div>
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="font-serif text-3xl font-light text-emerald-300">{num}</span>
          <span className="text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
            {category}
          </span>
        </div>

        <div className="mt-5 text-left">
          <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">{desc}</p>
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
