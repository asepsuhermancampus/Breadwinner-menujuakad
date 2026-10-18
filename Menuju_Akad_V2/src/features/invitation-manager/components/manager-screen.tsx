"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "./project-card";
import { AddressInspector } from "./address-inspector";
import { DomainPanel } from "./domain-panel";
import { ThemeComparePanel } from "./theme-compare-panel";
import { AnalyticsPanel } from "./analytics-panel";
import { ModerationPanel } from "./moderation-panel";
import { checkSlug } from "../domain/slug";
import {
  invitationManagerSummary,
  invitationProjects,
  managerNote,
} from "@/features/invitation-manager/content/manager-content";
import type { InvitationProject, SlugCheckResult } from "../types/manager";

type View = "all" | "compare" | "analytics" | "moderation" | "domain";

export function ManagerScreen() {
  const [view, setView] = useState<View>("all");
  const [projects, setProjects] = useState(invitationProjects);
  const [addressFor, setAddressFor] = useState<InvitationProject | null>(null);
  const [slugDraft, setSlugDraft] = useState("andi-risa-story");
  const [slugResult, setSlugResult] = useState<SlugCheckResult | null>(null);

  function openAddress(p: InvitationProject) {
    setAddressFor(p);
    setSlugDraft("andi-risa-story");
    setSlugResult(checkSlug("andi-risa-story"));
  }

  function draftSlug(slug: string) {
    setSlugDraft(slug);
    setSlugResult(slug ? checkSlug(slug) : null);
  }

  function saveAddress() {
    if (addressFor && slugResult?.status === "AVAILABLE") {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === addressFor.id ? { ...p, slug: slugResult.slug, slugStatus: "NOT_PUBLISHED" } : p,
        ),
      );
    }
    setAddressFor(null);
  }

  function continueDraft(p: InvitationProject) {
    setView("all");
    setProjects((prev) => prev.map((q) => (q.id === p.id ? q : q)));
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Undangan yang terasa personal.</h1>
          <p className="mt-1 text-xs text-secondary">
            Pernikahan, lamaran, dan setiap momen yang ingin Anda bagi.
          </p>
        </div>
        <Button onClick={() => setView("all")}>Buat undangan</Button>
      </div>

      <nav
        className="flex flex-wrap gap-2 border-b border-border pb-2"
        aria-label="Manajemen undangan"
      >
        {(
          [
            ["all", "Semua undangan"],
            ["compare", "Bandingkan tema"],
            ["analytics", "Analitik"],
            ["moderation", "Moderasi"],
            ["domain", "Domain · internal"],
          ] as [View, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            aria-current={view === key ? "page" : undefined}
            className={`min-h-11 rounded-control px-3 text-xs font-semibold ${
              view === key
                ? "bg-primary text-white"
                : "bg-subtle text-secondary hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {view === "all" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Undangan",
                value: String(invitationManagerSummary.projectCount),
                note: "1 terbit · 2 draf",
              },
              {
                label: "Data tamu Pernikahan",
                value: invitationManagerSummary.weddingGuestPoolLabel,
                note: "Satu sumber data, beberapa varian",
              },
              {
                label: "Versi aktif",
                value: invitationManagerSummary.activeVersionLabel,
                note: invitationManagerSummary.activeVersionNote,
              },
              {
                label: "Status akun",
                value: invitationManagerSummary.packageLabel,
                note: "Lifetime tersedia sebagai upgrade",
              },
            ].map((m) => (
              <div key={m.label} className="rounded-card border border-border bg-surface p-4">
                <p className="text-[10px] font-bold tracking-widest text-secondary">{m.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{m.value}</p>
                <p className="mt-0.5 text-[11px] text-muted">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpenAddress={openAddress}
                onContinue={continueDraft}
                onOpenStudio={() => {
                  window.location.href = "/planner/invitations/studio";
                }}
                onPreview={() => {
                  window.location.href = "/i/token-budi-a7c6";
                }}
              />
            ))}
          </div>

          <div className="rounded-card border border-border bg-canvas p-4">
            <p className="text-xs font-bold text-foreground">{managerNote.title}</p>
            <p className="mt-1 text-xs text-secondary">{managerNote.body}</p>
          </div>
        </>
      )}

      {view === "compare" && (
        <ThemeComparePanel
          onUseEditorial={() => {
            window.location.href = "/planner/invitations/studio";
          }}
        />
      )}
      {view === "analytics" && <AnalyticsPanel />}
      {view === "moderation" && <ModerationPanel />}
      {view === "domain" && <DomainPanel />}

      <AddressInspector
        open={Boolean(addressFor)}
        onClose={() => setAddressFor(null)}
        slug={slugDraft}
        result={slugResult}
        onDraftSlug={draftSlug}
        onSave={saveAddress}
      />
    </div>
  );
}
