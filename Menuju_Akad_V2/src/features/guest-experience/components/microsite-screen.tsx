"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { GuestGuideSection } from "./guest-guide-section";
import { GuestGallerySection } from "./guest-gallery-section";
import { SessionRsvpSection } from "./session-rsvp-section";
import { WishesSection } from "./wishes-section";
import { MomentsSection } from "./moments-section";
import { GiftsSection } from "./gifts-section";
import { OptionalFeaturesPanel } from "./optional-features-panel";
import {
  guestExperienceContent,
  rsvpSessionsFixture,
} from "@/features/guest-experience/content/experience-content";
import { createSessionRsvpAdapter } from "../domain/session-rsvp";
import type { GuestSection } from "../types/experience";

const NAV: { section: GuestSection; label: string; icon: string }[] = [
  { section: "home", label: "Profil & Cerita", icon: "heart" },
  { section: "guide", label: "Panduan Acara", icon: "map-trifold" },
  { section: "gallery", label: "Galeri", icon: "flower" },
  { section: "rsvp", label: "RSVP per Sesi", icon: "check-square" },
  { section: "wishes", label: "Ucapan & Doa", icon: "mail" },
  { section: "moments", label: "Kirim Foto", icon: "upload" },
  { section: "gifts", label: "Hadiah (nonaktif)", icon: "gift" },
];

export function MicrositeScreen() {
  const [section, setSection] = useState<GuestSection>("home");
  const [rsvpAdapter] = useState(() => createSessionRsvpAdapter(rsvpSessionsFixture));
  const back = () => setSection("home");

  return (
    <main id="main-content" className="min-h-screen bg-canvas text-foreground">
      <div className="mx-auto w-full max-w-[430px] bg-surface shadow-sm">
        {section === "home" && <HomeSection onNavigate={setSection} />}

        {section === "guide" && <GuestGuideSection onBack={back} />}
        {section === "gallery" && <GuestGallerySection onBack={back} />}
        {section === "rsvp" && <SessionRsvpSection onBack={back} adapter={rsvpAdapter} />}
        {section === "wishes" && <WishesSection onBack={back} />}
        {section === "moments" && <MomentsSection onBack={back} />}
        {section === "gifts" && <GiftsSection onBack={back} />}

        {section !== "home" && (
          <footer className="border-t border-border bg-subtle p-4 text-center text-[11px] text-muted">
            Menuju Akad · Platform Pernikahan Terkurasi
          </footer>
        )}
      </div>
    </main>
  );
}

function HomeSection({ onNavigate }: { onNavigate: (s: GuestSection) => void }) {
  const c = guestExperienceContent;
  return (
    <>
      <div className="relative">
        <img
          src="/assets/images/editorial-7.png"
          alt="Mempelai Andi & Risa"
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/55 to-transparent p-6 pb-8 text-white">
          <p className="text-[10px] font-bold tracking-[0.2em]">{c.eyebrow}</p>
          <h1 className="mt-1 whitespace-pre-line text-center font-serif text-4xl leading-tight">
            {c.heading}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 px-5 py-6">
        <div className="grid gap-4 text-center">
          {c.couple.map((p) => (
            <div key={p.name}>
              <p className="font-serif text-2xl text-foreground">{p.name}</p>
              <p className="mt-0.5 text-[11px] text-secondary">{p.family}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          <h2 className="text-center font-serif text-2xl text-foreground">
            {"Sejak pertemuan\npertama."}
          </h2>
          <p className="text-center text-xs text-secondary">
            Linimasa ilustratif untuk pratinjau; bukan riwayat yang telah diverifikasi.
          </p>
          {c.story.map((s) => (
            <div
              key={s.year}
              className="flex gap-3 rounded-card border border-border bg-canvas p-3"
            >
              <span className="font-mono text-sm font-bold text-brand-secondary">{s.year}</span>
              <span className="text-xs text-secondary">{s.description}</span>
            </div>
          ))}
        </div>

        <nav className="grid gap-2" aria-label="Bagian undangan">
          {NAV.map((item) => (
            <button
              key={item.section}
              type="button"
              onClick={() => onNavigate(item.section)}
              className="flex min-h-11 items-center gap-2.5 rounded-control border border-border bg-surface px-3 text-left text-xs font-semibold text-foreground hover:bg-subtle"
            >
              <Icon name={item.icon} size={15} className="text-brand-secondary" />
              <span className="flex-1">{item.label}</span>
              <Icon name="chevron-right" size={14} className="text-muted" />
            </button>
          ))}
        </nav>

        <OptionalFeaturesPanel onGallery={() => onNavigate("gallery")} />

        <div className="rounded-card border border-border bg-canvas p-4 text-center">
          <p className="text-xs font-bold text-foreground">{c.eventNote.title}</p>
          <p className="mt-1 text-xs text-secondary">{c.eventNote.body}</p>
        </div>

        <Button className="w-full" onClick={() => onNavigate("guide")}>
          Lihat detail acara
        </Button>
      </div>
    </>
  );
}
