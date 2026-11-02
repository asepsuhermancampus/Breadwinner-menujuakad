"use client";

import { useState } from "react";
import { FileText, Utensils, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const featureTabs = [
  {
    id: "kua",
    label: "Berkas KUA",
    badge: "Syarat Resmi",
    icon: FileText,
    title: "Kelengkapan Berkas Nikah KUA",
    desc: "Panduan runtut syarat administrasi Kemenag dari tingkat Kelurahan hingga KUA Kecamatan tanpa perlu bolak-balik.",
    items: [
      { text: "Form N1 — Pengantar Nikah dari Kelurahan", status: "Lengkap" },
      { text: "Form N2 & N4 — Kehendak & Persetujuan Calon Mempelai", status: "Lengkap" },
      { text: "Surat Keterangan Sehat & Sertifikat Elsimil Catin", status: "Terverifikasi" },
      { text: "Pas Foto Berlatar Biru (Ukuran 2x3 dan 4x6)", status: "Siap Cetak" },
    ],
  },
  {
    id: "catering",
    label: "Kalkulator Katering",
    badge: "Hitung Otomatis",
    icon: Utensils,
    title: "Simulasi Porsi Katering Presisi",
    desc: "Hitung rasio buffet dan stall berdasarkan jumlah undangan agar hidangan cukup tanpa pemborosan dana.",
    items: [
      { text: "Basis Undangan: 300 Undangan (Estimasi 600 Pax Hadir)", status: "Basis Standar" },
      { text: "Porsi Buffet Utama (60%): 360 Porsi", status: "Terhitung" },
      { text: "Porsi Gubukan / Stall (4x Undangan): 1.200 Porsi", status: "Rasio Ideal" },
      { text: "Estimasi Biaya Katering Terencana Realistis", status: "Terkontrol" },
    ],
  },
  {
    id: "rundown",
    label: "Rundown Menit ke Menit",
    badge: "Jadwal Akad",
    icon: Clock,
    title: "Susunan Rundown Acara Hari H",
    desc: "Bagi waktu dan peran pengarah acara (WO/Keluarga) dengan menit yang terencana presisi.",
    items: [
      { text: "07.00 — Kehadiran MUA, Mempelai & Keluarga Inti", status: "Persiapan" },
      { text: "08.00 — Pembacaan Ayat Suci, Khutbah & Ijab Kabul", status: "Inti Akad" },
      { text: "09.00 — Penyerahan Mahar, Buku Nikah & Sungkeman", status: "Khidmat" },
      { text: "10.00 — Ramah Tamah, Doa Bersama & Sesi Foto", status: "Resepsi" },
    ],
  },
  {
    id: "emergency",
    label: "Tas Darurat Hari H",
    badge: "Siaga Bencana",
    icon: AlertCircle,
    title: "Daftar Perlengkapan Darurat",
    desc: "Checklist tas siaga pengantin untuk mengatasi kendala tak terduga di lokasi acara.",
    items: [
      { text: "Kotak P3K, minyak angin, dan pereda sakit kepala", status: "Siaga" },
      { text: "Peniti, jarum pentul, benang jahit, dan gunting mini", status: "Siaga" },
      { text: "Sandal ganti nyaman dan plester kaki anti-lecet", status: "Siaga" },
      { text: "Baterai cadangan mic wireless & charger darurat", status: "Siaga" },
    ],
  },
];

type FeatureTab = (typeof featureTabs)[number];
const defaultTab = featureTabs[0] as FeatureTab;

export function LandingValues() {
  const [activeTab, setActiveTab] = useState<string>(defaultTab.id);
  const current: FeatureTab = featureTabs.find((t) => t.id === activeTab) ?? defaultTab;
  const IconComponent = current.icon;

  return (
    <section id="tentang" className="border-b border-ux-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
            Eksplorasi Modul Perencana
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl">
            Modul lengkap yang jarang ada di aplikasi lain
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary sm:text-base">
            Bukan sekadar catatan biasa. Menuju Akad menyediakan modul praktis siap pakai yang
            benar-benar dibutuhkan calon pengantin di Indonesia.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {featureTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-brand-secondary text-white shadow-sm"
                    : "bg-ux-dock text-secondary hover:bg-neutral-200/70 hover:text-foreground"
                }`}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Showcase Box */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-ux-border bg-ux-dock/60 p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-0.5 text-[11px] font-semibold text-emerald-800">
                <IconComponent size={13} />
                <span>{current.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-brand-secondary sm:text-2xl">
                {current.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">{current.desc}</p>
            </div>

            <div className="space-y-2.5 lg:col-span-7">
              {current.items.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center justify-between gap-3 rounded-xl border border-ux-border bg-surface px-4 py-3 text-xs shadow-xs"
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                    <span className="font-medium">{item.text}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-600/20">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
