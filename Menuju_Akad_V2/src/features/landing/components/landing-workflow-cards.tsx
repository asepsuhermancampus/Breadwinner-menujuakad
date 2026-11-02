import { Heart, Check, QrCode, Wallet, CheckCircle2 } from "lucide-react";

/**
 * Visual Ruang Bersama: Replika tampilan profil pasangan di halaman Dashboard
 */
export function StepOneVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold text-white">Ruang Privat Pasangan</span>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200">
          Akun Terhubung
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-left">
        <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
          <span className="block text-[10px] text-emerald-200/70">Mempelai Wanita</span>
          <span className="font-semibold text-white text-xs">Sarah</span>
          <span className="block text-[10px] text-white/50">Pembuat Ruang</span>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.04] p-2.5">
          <div className="flex items-center justify-between">
            <span className="block text-[10px] text-amber-200/70">Mempelai Pria</span>
            <Heart size={10} className="fill-amber-300 text-amber-300" />
          </div>
          <span className="font-semibold text-white text-xs">Dimas</span>
          <span className="block text-[10px] text-white/50">Partner Terverifikasi</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-1 text-[11px] text-emerald-100/80">
        <span>Kesiapan Akad & Berkas</span>
        <span className="font-semibold text-emerald-300">75% Siap</span>
      </div>
    </div>
  );
}

/**
 * Visual Rencana & Biaya: Replika modul Tabungan, Anggaran & Checklist Dashboard
 */
export function StepTwoVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-white">
          <Wallet size={14} className="text-emerald-300" />
          <span className="font-semibold">Anggaran Acara</span>
        </div>
        <span className="font-mono text-xs font-semibold text-emerald-200">
          Rp 85.000.000
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-emerald-100/80">
          <span>Checklist Tugas Acara</span>
          <span className="font-mono font-medium text-white">18/24 Selesai</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{ width: "75%" }}
          />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
        <span className="inline-flex items-center gap-1 text-emerald-100/80">
          <CheckCircle2 size={11} className="text-emerald-300" />
          Berkas KUA (N1, N2, N4)
        </span>
        <span className="rounded-sm bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
          8/8 Lengkap
        </span>
      </div>
    </div>
  );
}

/**
 * Visual Undangan & Tamu: Replika modul Undangan Digital, Daftar Tamu & QR Check-in
 */
export function StepThreeVisual() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="block font-serif text-xs italic text-emerald-200">
            Sarah & Dimas
          </span>
          <span className="text-[10px] text-white/60">Tema Editorial Light</span>
        </div>
        <div className="flex size-7 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-400/10 text-amber-200">
          <QrCode size={14} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-100/80">
        <span>Daftar Tamu Tercatat</span>
        <span className="font-mono font-semibold text-white">450 Tamu</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-emerald-100/80">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Kehadiran Tamu (RSVP)
        </span>
        <span className="font-semibold text-emerald-300">92% Konfirmasi Hadir</span>
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
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:p-7 backdrop-blur-xl">
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
          <p className="mt-2 text-xs leading-relaxed text-emerald-100/85 sm:text-sm">
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
