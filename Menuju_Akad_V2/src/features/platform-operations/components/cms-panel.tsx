import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OperationDialog as Dialog } from "./operation-panel";
import { Status } from "@/components/ui/status";
import { contentCategories, contentEntries } from "../content/cms";
import type { ContentEntry } from "../types/operations";
import type { PanelProps } from "../types/panel";
import { Badge, Inspector, OperationHeading, OperationNote } from "./operation-ui";
import { CmsEditor } from "./cms-editor";
export function CmsPanel({ context }: PanelProps) {
  const [entries, setEntries] = useState(contentEntries);
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState("TPL-012");
  const [editing, setEditing] = useState(false);
  const [playground, setPlayground] = useState(false);
  const [saved, setSaved] = useState("");
  const entry = entries.find((item) => item.id === selected)!;
  const rows = entries.filter((item) => category === "Semua" || item.category === category);
  function update(updated: ContentEntry) {
    setEntries((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSaved(
      `${updated.id} · aktif v${updated.active}${updated.draft ? ` / draf v${updated.draft}` : ""} tersimpan dalam simulasi. Proyek dan entitlement pembeli tidak berubah.`,
    );
  }
  return (
    <>
      <OperationHeading
        title="Konten baru, publikasi yang disengaja."
        description="Template, paket, landing, blog SEO dan legal memakai versi serta izin publikasi terpisah."
        action={<Button onClick={() => setEditing(true)}>Review publikasi konten</Button>}
      />
      {saved && <Status tone="success">{saved}</Status>}
      <div className="flex flex-wrap gap-2" aria-label="Kategori konten">
        {contentCategories.map((name) => (
          <Button
            key={name}
            variant={category === name ? "primary" : "ghost"}
            size="small"
            aria-pressed={category === name}
            onClick={() => {
              setCategory(name);
              const first = entries.find((item) => name === "Semua" || item.category === name);
              if (first) setSelected(first.id);
            }}
          >
            {name}
          </Button>
        ))}
      </div>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="grid min-w-0 content-start gap-5">
          <div className="overflow-x-auto rounded-card border border-ux-border">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">Versi konten global</caption>
              <thead className="bg-ux-dock text-secondary">
                <tr>
                  {["Konten", "Aktif", "Draf", "Status"].map((title) => (
                    <th key={title} scope="col" className="p-4 font-medium">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t border-ux-border ${item.id === selected ? "bg-ux-soft" : ""}`}
                  >
                    <th scope="row" className="p-3 font-medium">
                      <Button
                        variant="ghost"
                        size="small"
                        aria-pressed={item.id === selected}
                        onClick={() => setSelected(item.id)}
                      >
                        {item.id} · {item.title}
                      </Button>
                    </th>
                    <td className="p-3 font-mono">v{item.active}</td>
                    <td className="p-3 font-mono">{item.draft ? `v${item.draft}` : "—"}</td>
                    <td className="p-3">
                      <Badge>{item.draft ? "Perlu review" : "Terbit"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <OperationNote title="Versi template bukan versi proyek undangan">
            TPL-012 v12 berbeda dengan proyek Andi & Risa v3. Memublikasikan template baru tidak
            mengubah undangan yang sudah terbit atau paket yang sudah dimiliki.
          </OperationNote>
        </div>
        <Inspector
          title="Preview versi"
          description={`${entry.id} · ${entry.draft ? `draf v${entry.draft}` : `aktif v${entry.active}`}`}
        >
          <div className="rounded-control border border-ux-border bg-canvas px-5 py-10 text-center">
            <p className="text-[10px] tracking-widest text-secondary">
              PREVIEW DEMO / TANPA DATA TAMU
            </p>
            <p className="my-6 font-serif text-4xl">
              {entry.category === "Template" ? "Andi & Risa" : entry.title}
            </p>
            <p className="text-xs leading-relaxed text-secondary">{entry.text}</p>
          </div>
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit / review draf
          </Button>
          <Button variant="ghost" onClick={() => setPlayground(true)}>
            Buka playground aset
          </Button>
          <p className="text-xs text-secondary">
            Draft tidak diindeks. Review metadata SEO dan dampak legal sebelum publikasi.
          </p>
        </Inspector>
      </div>
      {editing && (
        <CmsEditor
          entry={entry}
          context={context}
          onClose={() => setEditing(false)}
          onSave={update}
        />
      )}
      <Dialog
        open={playground}
        onClose={() => setPlayground(false)}
        title="Playground aset · demo privat"
      >
        <div className="grid gap-4">
          <p className="font-serif text-4xl">Andi & Risa</p>
          <p className="text-sm text-secondary">
            {entry.id} · {entry.title} · versi {entry.draft ?? entry.active}
          </p>
          <Status>
            Preview memakai teks demo tanpa data tamu. Pilihan ini tidak mengubah undangan atau
            paket pembeli.
          </Status>
          <Button
            onClick={() => {
              setPlayground(false);
              setEditing(true);
            }}
          >
            Buka editor draf
          </Button>
        </div>
      </Dialog>
    </>
  );
}
