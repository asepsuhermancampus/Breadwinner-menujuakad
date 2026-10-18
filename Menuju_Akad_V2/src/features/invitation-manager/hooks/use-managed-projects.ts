"use client";

import { useEffect, useState } from "react";
import { invitationProjects } from "../content/manager-content";
import type { InvitationProject } from "../types/manager";

export function useManagedProjects() {
  const [projects, setProjects] = useState(invitationProjects);
  useEffect(() => {
    const readRecovery = () => {
      const merged = new Map(invitationProjects.map((project) => [project.id, { ...project }]));
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key?.startsWith("ma-studio-v1:")) continue;
          const state = JSON.parse(localStorage.getItem(key) ?? "null");
          const doc = state?.document;
          if (
            !doc ||
            typeof doc.projectId !== "string" ||
            typeof doc.title !== "string" ||
            !doc.content ||
            !Number.isInteger(doc.revision)
          )
            continue;
          if (doc.draftStatus !== "editing" && !doc.activeVersion) {
            merged.delete(doc.projectId);
            continue;
          }
          const previous = merged.get(doc.projectId);
          const published = doc.publication === "published" && doc.activeVersion;
          const project: InvitationProject = {
            id: doc.projectId,
            kind: doc.eventId === "event-engagement" ? "ENGAGEMENT" : (previous?.kind ?? "WEDDING"),
            state: published ? "PUBLISHED" : "DRAFT",
            title: doc.title,
            eventDateText: doc.content.date,
            invitationCount: previous?.invitationCount ?? 0,
            activeVersion: published ? doc.activeVersion : null,
            draftVersion: doc.draftStatus === "editing" ? doc.revision : null,
            slug: previous?.slug ?? null,
            slugStatus: previous?.slugStatus ?? "NOT_PUBLISHED",
            sourcePool: previous?.sourcePool ?? null,
            thumbnail: previous?.thumbnail ?? "/assets/images/generated.png",
          };
          merged.set(project.id, project);
        }
        const drafts = JSON.parse(localStorage.getItem("ma-invitation-slugs") ?? "{}");
        for (const [id, project] of merged)
          if (typeof drafts[id] === "string") merged.set(id, { ...project, draftSlug: drafts[id] });
        setProjects([...merged.values()]);
      } catch {
        /* Existing project fixtures remain available if local recovery is unavailable. */
      }
    };
    const timer = setTimeout(readRecovery, 0);
    return () => clearTimeout(timer);
  }, []);
  function saveDraftSlug(id: string, slug: string) {
    setProjects((items) =>
      items.map((item) => (item.id === id ? { ...item, draftSlug: slug } : item)),
    );
    try {
      const values = JSON.parse(localStorage.getItem("ma-invitation-slugs") ?? "{}");
      localStorage.setItem("ma-invitation-slugs", JSON.stringify({ ...values, [id]: slug }));
    } catch {
      /* Address stays a local draft and never replaces the active address. */
    }
  }
  return { projects, saveDraftSlug };
}
