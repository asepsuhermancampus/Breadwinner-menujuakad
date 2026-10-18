"use client";

import { useState } from "react";
import type { StudioSettings, InvitationTheme } from "../types/studio";
import { ThemeGallery } from "./theme-gallery";
import { DraftSettingsView } from "./draft-settings-view";
import { PublishReviewDialog } from "./publish-review-dialog";

type Props = {
  initialSettings?: StudioSettings;
};

export function StudioScreen({ initialSettings }: Props) {
  const [tab, setTab] = useState<"themes" | "settings">("settings");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishedNotice, setPublishedNotice] = useState(false);

  const [settings, setSettings] = useState<StudioSettings>(
    initialSettings || {
      activeTheme: "editorial",
      draftTheme: "editorial",
      draftVersion: 4,
      publishedVersion: 3,
      rsvpDeadline: "7 Februari 2027, 23.59 WIB",
      searchEngineIndex: false,
      giftAccountActive: false,
      autoplayMusic: false,
      lastDraftSavedAt: "10.42 WIB",
    },
  );

  function handleSelectTheme(t: InvitationTheme) {
    setSettings((prev) => ({
      ...prev,
      draftTheme: t,
      lastDraftSavedAt: "Baru saja",
    }));
  }

  function handleUpdateSetting<K extends keyof StudioSettings>(key: K, val: StudioSettings[K]) {
    setSettings((prev) => ({
      ...prev,
      [key]: val,
      lastDraftSavedAt: "Baru saja",
    }));
  }

  function handlePublish() {
    setSettings((prev) => ({
      ...prev,
      activeTheme: prev.draftTheme,
      publishedVersion: prev.draftVersion,
      draftVersion: prev.draftVersion + 1,
    }));
    setPublishedNotice(true);
    setTimeout(() => setPublishedNotice(false), 4000);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Studio Undangan</h1>
          <p className="text-xs text-secondary mt-1">
            Konfigurasi tampilan, tema, dan kebijakan privasi untuk seluruh undangan personal tamu.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/planner/guests"
            className="text-xs font-semibold px-3 py-2 bg-subtle text-secondary rounded-control hover:text-foreground"
          >
            ← Kembali ke CRM Tamu
          </a>
        </div>
      </div>

      {publishedNotice && (
        <div className="p-3 bg-success-bg text-success border border-success/40 rounded-control text-xs font-semibold">
          ✓ Versi undangan berhasil dipublikasikan! Seluruh tautan personal tamu kini memakai versi
          terbaru.
        </div>
      )}

      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setTab("settings")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            tab === "settings" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          RSVP & Privasi (Draf)
        </button>
        <button
          type="button"
          onClick={() => setTab("themes")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            tab === "themes" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          Galeri Tema
        </button>
      </div>

      {tab === "settings" && (
        <DraftSettingsView
          settings={settings}
          onUpdateSetting={handleUpdateSetting}
          onOpenPublish={() => setPublishOpen(true)}
        />
      )}

      {tab === "themes" && (
        <ThemeGallery
          activeTheme={settings.activeTheme}
          draftTheme={settings.draftTheme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      <PublishReviewDialog
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        settings={settings}
        onConfirmPublish={handlePublish}
      />
    </div>
  );
}
