"use client";

import { Button } from "@/components/ui/button";
import type { InvitationProject } from "../types/manager";

export function ProjectCard({
  project,
  onOpenAddress,
  onContinue,
  onOpenStudio,
  onPreview,
}: {
  project: InvitationProject;
  onOpenAddress: (p: InvitationProject) => void;
  onContinue: (p: InvitationProject) => void;
  onOpenStudio: () => void;
  onPreview: () => void;
}) {
  const published = project.state === "PUBLISHED";
  return (
    <article
      className={`rounded-card border p-5 ${
        published ? "border-ux-border bg-ux-dock" : "border-border bg-surface"
      }`}
    >
      <div className="flex gap-4">
        <img
          src={project.thumbnail}
          alt=""
          className="h-24 w-16 shrink-0 rounded-control object-cover"
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-bold tracking-widest ${
              published ? "text-success" : "text-secondary"
            }`}
          >
            {published ? `● TERBIT · V${project.activeVersion}` : "Draf · belum terbit"}
          </p>
          <h3 className="mt-1 text-sm font-bold text-foreground">{project.title}</h3>
          <p className="text-xs text-secondary">{project.eventDateText}</p>
          {project.slug ? (
            <button
              type="button"
              onClick={() => onOpenAddress(project)}
              className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-brand-secondary underline underline-offset-2"
            >
              menujuakad.id/{project.slug}
            </button>
          ) : (
            <p className="mt-1 text-xs text-muted">Alamat belum diterbitkan</p>
          )}
          {project.draftSlug && (
            <p className="mt-1 break-all font-mono text-xs text-secondary">
              Draf alamat: menujuakad.id/{project.draftSlug}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {published ? (
              <>
                <Button size="small" variant="secondary" onClick={onOpenStudio}>
                  Kembali ke studio
                </Button>
                <Button size="small" variant="secondary" onClick={onPreview}>
                  Lihat undangan
                </Button>
              </>
            ) : (
              <Button size="small" variant="secondary" onClick={() => onContinue(project)}>
                Lanjutkan draf →
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
