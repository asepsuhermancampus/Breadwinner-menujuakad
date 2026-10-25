"use client";
import { StudioNotice } from "./studio-notice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStudioEditor } from "../hooks/use-studio-editor";
import { StudioHeader } from "./studio-header";
import { StudioCanvas } from "./studio-canvas";
import { StudioForm } from "./studio-form";
import { StudioLayers } from "./studio-layers";
import { StudioSections } from "./studio-sections";
import { StudioInspector } from "./studio-inspector";
import { StudioAssets } from "./studio-assets";
import { StudioMotion } from "./studio-motion";
import { StudioResilience } from "./studio-resilience";
import styles from "./studio.module.css";
import { StudioDialogs, type StudioModal } from "./studio-dialogs";
type Panel = "sections" | "layers" | "assets" | "motion" | "resilience";
export function StudioScreen({
  projectId = "inv-wedding-main",
  previewActive = false,
  remote = false,
  workspaceId = "",
  readOnly = false,
}: {
  projectId?: string;
  previewActive?: boolean;
  remote?: boolean;
  workspaceId?: string;
  readOnly?: boolean;
}) {
  const editor = useStudioEditor(projectId, remote, workspaceId, readOnly);
  const router = useRouter();
  const [mode, setMode] = useState<"visual" | "form">("visual");
  const [panel, setPanel] = useState<Panel>("sections");
  const [selected, setSelected] = useState("couple-title");
  const [section, setSection] = useState("cover");
  const [zoom, setZoom] = useState(125);
  const [viewport, setViewport] = useState(375);
  const [mobile, setMobile] = useState<"content" | "canvas" | "inspector">("content");
  const [modal, setModal] = useState<StudioModal>(previewActive ? "active-preview" : null);
  const exit = () => router.push("/planner/invitations");
  if (!editor.ready)
    return (
      <main id="main-content" className="grid min-h-screen place-items-center" aria-busy="true">
        {editor.storageError ? (
          <div role="alert">
            {editor.storageError} <Button onClick={() => location.reload()}>Coba lagi</Button>
          </div>
        ) : (
          <p role="status">Membuka studio…</p>
        )}
      </main>
    );
  const archived = editor.state.document.draftStatus !== "editing";
  return (
    <main
      id="main-content"
      className={styles.studio}
      data-reduced-motion={editor.state.document.motion.reducedMotion}
    >
      <StudioHeader
        editor={editor}
        mode={mode}
        onMode={(value) => {
          setMode(value);
          setPanel("sections");
          setMobile(value === "form" ? "content" : "canvas");
        }}
        zoom={zoom}
        onZoom={setZoom}
        viewport={viewport}
        onViewport={setViewport}
        onHistory={() => setModal("history")}
        onReview={() => setModal("review")}
        onPreview={() => setModal("preview")}
        onSettings={() => setModal("settings")}
        onExit={() =>
          editor.state.dirty || editor.storageError || editor.persisting ? setModal("exit") : exit()
        }
      />
      <StudioNotice editor={editor} />
      {archived && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-subtle px-5 py-3 text-sm">
          <p>
            Draf {editor.state.document.draftStatus === "archived" ? "diarsipkan" : "dihapus"}.
            Snapshot aktif tetap utuh.
          </p>
          <Button size="small" disabled={remote} onClick={() => setModal("history")}>
            Pulihkan sebagai draf baru
          </Button>
        </div>
      )}
      <nav className={styles.mobileTabs} aria-label="Panel studio compact">
        {(
          [
            ["content", "Form & bagian"],
            ["canvas", "Kanvas"],
            ["inspector", "Properti"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="small"
            variant={mobile === key ? "primary" : "ghost"}
            onClick={() => setMobile(key)}
          >
            {label}
          </Button>
        ))}
      </nav>
      <div className={`${styles.workspace} ${mode === "form" ? styles.formMode : ""}`}>
        <aside
          className={`${styles.left} ${mobile !== "content" ? styles.mobileHidden : ""}`}
          aria-label="Bagian dan layer"
        >
          <div className="mb-5 flex flex-wrap gap-1">
            {(
              [
                ["sections", "Seksi"],
                ["layers", "Layer"],
                ["assets", "Aset"],
                ["motion", "Gerak"],
                ["resilience", "Status"],
              ] as const
            )
              .filter(([key]) => !remote || key !== "resilience")
              .map(([key, label]) => (
                <Button
                  key={key}
                  size="small"
                  variant={panel === key ? "primary" : "ghost"}
                  onClick={() => setPanel(key)}
                >
                  {label}
                </Button>
              ))}
          </div>
          <fieldset disabled={archived || !editor.state.environment.canEdit} className="min-w-0">
            {panel === "sections" &&
              (mode === "form" ? (
                <StudioForm editor={editor} />
              ) : (
                <StudioSections editor={editor} selected={section} onSelect={setSection} />
              ))}
            {panel === "layers" && (
              <StudioLayers editor={editor} selected={selected} onSelect={setSelected} />
            )}
            {panel === "assets" && <StudioAssets editor={editor} />}
            {panel === "motion" && <StudioMotion editor={editor} />}
          </fieldset>
          {panel === "resilience" && <StudioResilience editor={editor} />}
          <Button
            className="mt-6 w-full"
            size="small"
            variant="secondary"
            onClick={() => setModal("project")}
          >
            Kelola proyek
          </Button>
        </aside>
        <section
          className={`${styles.canvas} ${mobile !== "canvas" ? styles.mobileHidden : ""}`}
          aria-label="Kanvas draf"
        >
          <StudioCanvas editor={editor} selected={selected} onSelect={setSelected} zoom={zoom} />
        </section>
        <aside
          className={`${styles.right} ${mobile !== "inspector" ? styles.mobileHidden : ""}`}
          aria-label="Inspector properti"
        >
          <fieldset disabled={archived || !editor.state.environment.canEdit} className="min-w-0">
            <StudioInspector editor={editor} selected={selected} />
          </fieldset>
        </aside>
      </div>
      <StudioDialogs
        editor={editor}
        modal={modal}
        setModal={setModal}
        viewport={viewport}
        onExit={exit}
        onFix={() => {
          setModal(null);
          setMode("form");
          setPanel("sections");
          setMobile("content");
        }}
      />
    </main>
  );
}
