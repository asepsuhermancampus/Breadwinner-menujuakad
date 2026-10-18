"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import type { WaMessageCampaignItem } from "../types/guest";

export function WhatsappResultsView({ initialItems }: { initialItems?: WaMessageCampaignItem[] }) {
  const [items, setItems] = useState<WaMessageCampaignItem[]>(
    initialItems || [
      {
        id: "w1",
        recipientName: "Dewi Anggraini",
        phone: "+62 813 •••• 7820",
        status: "Terkirim",
        detail: "10.20 · diterima perangkat",
        canRetry: false,
        sentAt: "10.20 WIB",
      },
      {
        id: "w2",
        recipientName: "Irma Sari",
        phone: "+62 812 •••• 5181",
        status: "Terkirim",
        detail: "10.20 · diterima perangkat",
        canRetry: false,
        sentAt: "10.20 WIB",
      },
      {
        id: "w3",
        recipientName: "Rafi & keluarga",
        phone: "+62 851 •••• 3042",
        status: "Terkirim",
        detail: "10.20 · diterima perangkat",
        canRetry: false,
        sentAt: "10.20 WIB",
      },
      {
        id: "w4",
        recipientName: "Hana Putri",
        phone: "+62 821 •••• 6173",
        status: "Diproses",
        detail: "Menunggu pembaruan penyedia",
        canRetry: false,
        sentAt: "10.20 WIB",
      },
      {
        id: "w5",
        recipientName: "Reza Kurniawan",
        phone: "+62 878 •••• 9912",
        status: "Gagal",
        detail: "Penyedia: nomor tidak aktif sementara",
        canRetry: true,
        sentAt: "10.20 WIB",
      },
    ],
  );

  function handleRetry(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Terkirim",
              detail: "10.24 · berhasil dikirim ulang",
              canRetry: false,
            }
          : item,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface rounded-control border border-border flex flex-wrap justify-between items-center gap-2">
        <div>
          <h3 className="font-bold text-foreground">Hasil Pengiriman Kampanye</h3>
          <p className="text-xs text-secondary mt-0.5">
            Kampanye 25 Okt 2026, 10.20 WIB · Pengiriman terarah ke 10 penerima yang memenuhi syarat
          </p>
        </div>
        <div className="text-xs bg-subtle px-3 py-1.5 rounded-control border border-border">
          <span className="text-secondary">Prinsip Retry:</span>{" "}
          <strong className="text-foreground">
            Hanya pesan gagal definitif yang dapat dikirim ulang
          </strong>
        </div>
      </div>

      <div className="bg-surface rounded-control border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-3">Penerima</th>
                <th className="p-3">Nomor</th>
                <th className="p-3">Status</th>
                <th className="p-3">Keterangan</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-subtle/50"
                >
                  <td className="p-3 font-semibold text-foreground">{item.recipientName}</td>
                  <td className="p-3 font-mono">{item.phone}</td>
                  <td className="p-3">
                    {item.status === "Terkirim" && <Status tone="success">Terkirim</Status>}
                    {item.status === "Diproses" && <Status tone="warning">Diproses</Status>}
                    {item.status === "Gagal" && <Status tone="danger">Gagal Definitif</Status>}
                  </td>
                  <td className="p-3 text-secondary">{item.detail}</td>
                  <td className="p-3">
                    {item.canRetry ? (
                      <Button
                        variant="secondary"
                        size="small"
                        className="text-xs border-danger text-danger hover:bg-danger-bg"
                        onClick={() => handleRetry(item.id)}
                      >
                        Kirim Ulang
                      </Button>
                    ) : (
                      <span className="text-secondary text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
