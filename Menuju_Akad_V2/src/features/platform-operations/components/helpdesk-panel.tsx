import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OperationDialog as Dialog } from "./operation-panel";
import { tickets } from "../content/helpdesk";
import type { PanelProps } from "../types/panel";
import { Inspector, OperationHeading, OperationNote, Badge } from "./operation-ui";
import { TicketConversation } from "./ticket-conversation";
export function HelpdeskPanel({ context, role }: PanelProps) {
  const [selected, setSelected] = useState("TK-2048");
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const ticket = tickets.find((item) => item.id === selected)!;
  const filtered = tickets.filter((item) =>
    `${item.id} ${item.title} ${item.status}`.toLowerCase().includes(search.toLowerCase()),
  );
  function choose(id: string) {
    if (dirty) setPending(id);
    else setSelected(id);
  }
  return (
    <>
      <OperationHeading
        title="Bantuan yang memahami konteks."
        description="12 tiket aktif · 4 contoh ditampilkan · percakapan, catatan internal dan data keuangan dipisah."
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,440px)]">
        <div className="grid min-w-0 content-start gap-5">
          <Field
            label="Cari tiket"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nomor tiket atau topik"
          />
          <div className="overflow-x-auto rounded-card border border-ux-border">
            <table className="w-full text-left text-xs">
              <caption className="sr-only">4 contoh dari 12 tiket aktif</caption>
              <thead className="bg-ux-dock text-secondary">
                <tr>
                  {["Tiket / topik", "Prioritas", "Status"].map((title) => (
                    <th key={title} scope="col" className="p-4 font-medium">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t border-ux-border ${selected === item.id ? "bg-ux-soft" : ""}`}
                  >
                    <th className="p-3 font-medium" scope="row">
                      <Button
                        size="small"
                        variant="ghost"
                        onClick={() => choose(item.id)}
                        aria-pressed={selected === item.id}
                      >
                        {item.id} · {item.title}
                      </Button>
                    </th>
                    <td className="p-3">{item.priority}</td>
                    <td className="p-3">
                      <Badge>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <p role="status" className="p-5 text-sm text-secondary">
                Tidak ada tiket sesuai pencarian.
              </p>
            )}
          </div>
          <OperationNote title="Batas akses helpdesk">
            Agent dapat membantu kasus, bukan membuka rekening, KTP atau mengekspor kontak tamu.
            Eskalasi ke pemilik izin terkait; bukan membagikan akses admin. Scope aktif: {role}.
          </OperationNote>
        </div>
        <Inspector title={`${ticket.id} · ${ticket.owner}`}>
          <TicketConversation
            key={ticket.id}
            ticket={ticket}
            context={context}
            onDirty={setDirty}
          />
        </Inspector>
      </div>
      <Dialog open={pending !== null} onClose={() => setPending(null)} title="Draf belum disimpan">
        <div className="grid gap-4">
          <p className="text-sm">Simpan draf sebelum pindah tiket, atau buang perubahan lokal.</p>
          <Button variant="secondary" onClick={() => setPending(null)}>
            Kembali ke draf
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (pending) setSelected(pending);
              setPending(null);
              setDirty(false);
            }}
          >
            Buang draf dan pindah
          </Button>
        </div>
      </Dialog>
    </>
  );
}
