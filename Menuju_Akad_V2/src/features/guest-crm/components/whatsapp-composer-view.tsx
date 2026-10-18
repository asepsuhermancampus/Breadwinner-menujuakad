"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WhatsappReviewDialog } from "./whatsapp-review-dialog";
import { WhatsappResultsView } from "./whatsapp-results-view";

export function WhatsappComposerView() {
  const [activeSubTab, setActiveSubTab] = useState<"composer" | "results">("composer");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [quota, setQuota] = useState(100);

  function handleDispatch() {
    setQuota((q) => Math.max(0, q - 10));
    setActiveSubTab("results");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("composer")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            activeSubTab === "composer" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          Kirim Undangan WA
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("results")}
          className={`text-xs font-semibold px-3 py-1.5 rounded ${
            activeSubTab === "results" ? "bg-primary text-white" : "bg-subtle text-secondary"
          }`}
        >
          Hasil Pengiriman Terkini
        </button>
      </div>

      {activeSubTab === "results" ? (
        <WhatsappResultsView />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-surface rounded-control border border-border space-y-4">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Template Pesan</label>
              <select className="w-full text-xs rounded-control border border-border bg-canvas px-3 py-2 font-medium">
                <option>Undangan pernikahan · Bahasa Indonesia · v1</option>
                <option>Pengingat RSVP · H-7 · v1</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary mb-1">
                Isi Template (Standar WhatsApp Business)
              </label>
              <div className="p-3 bg-subtle rounded-control text-xs font-mono whitespace-pre-wrap text-foreground border border-border leading-relaxed">
                {`Halo {{nama_tamu}},

Dengan bahagia, Andi & Risa mengundang Anda pada pernikahan kami.

Minggu, 14 Februari 2027
Akad 08.00 · Resepsi 10.00 WIB
Bumi Samami, Bandung

Undangan personal: {{tautan_personal}}
Mohon konfirmasi sebelum 7 Februari 2027.

Jika tidak ingin menerima pesan lagi, balas STOP.`}
              </div>
            </div>

            <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
              <strong>Token Opak:</strong> Tautan personal memakai token unik acak. Parameter URL
              tidak pernah memuat nama lengkap atau nomor telepon tamu.
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-secondary">
                Kuota contoh: <strong className="font-mono text-foreground">{quota} pesan</strong>{" "}
                tersedia
              </span>
              <Button variant="primary" onClick={() => setReviewOpen(true)}>
                Pilih 14 Penerima & Tinjau →
              </Button>
            </div>
          </div>

          <div className="p-4 bg-surface rounded-control border border-border flex flex-col">
            <div className="text-xs font-bold text-secondary mb-2 tracking-wide uppercase">
              Pratinjau Pesan · Dewi Anggraini
            </div>
            <div className="flex-1 bg-[#EFEAE2] p-4 rounded-xl flex flex-col justify-end">
              <div className="max-w-[85%] bg-white p-3 rounded-lg shadow-sm text-xs leading-relaxed text-foreground space-y-2">
                <p>
                  Halo <strong>Dewi Anggraini</strong>,
                </p>
                <p>Dengan bahagia, Andi & Risa mengundang Anda pada pernikahan kami.</p>
                <p className="font-semibold text-primary">
                  14 Februari 2027
                  <br />
                  Bumi Samami, Bandung
                </p>
                <p className="p-1.5 bg-subtle rounded text-primary font-mono text-[11px] underline">
                  menujuakad.id/i/••••b19d
                </p>
                <p className="text-[11px] text-secondary">
                  Konfirmasi sebelum 7 Februari 2027.
                  <br />
                  Balas STOP untuk berhenti.
                </p>
                <div className="text-[10px] text-right text-muted">10.20 ✓✓</div>
              </div>
            </div>
            <p className="text-[11px] text-secondary mt-2 text-center">
              Pratinjau desain sandbox. Tidak ada pesan atau biaya nyata yang diproses.
            </p>
          </div>
        </div>
      )}

      <WhatsappReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirmDispatch={handleDispatch}
      />
    </div>
  );
}
