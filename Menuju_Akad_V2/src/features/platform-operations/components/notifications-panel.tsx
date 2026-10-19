import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { OperationDialog as Dialog } from "./operation-panel";
import { Status } from "@/components/ui/status";
import { notificationLogs, operationsNow } from "../content/notifications";
import { inspectSameProvider, retryNotification } from "../domain/dispatch";
import { hasPermission } from "../domain/guards";
import type { Feedback } from "../types/operations";
import type { PanelProps } from "../types/panel";
import { CheckLine, Inspector, OperationHeading, OperationNote } from "./operation-ui";
import { NotificationTable } from "./notification-table";

export function NotificationsPanel({ context, role }: PanelProps) {
  const [logs, setLogs] = useState(notificationLogs);
  const [selected, setSelected] = useState("N-2041");
  const [reason, setReason] = useState("Kegagalan sementara sudah diperiksa.");
  const [ack, setAck] = useState(false);
  const [review, setReview] = useState<number | null>(null);
  const [keys, setKeys] = useState<string[]>(["campaign-01:dewi"]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const log = logs.find((item) => item.id === selected)!;
  const canRetry =
    log.status === "failed" && log.consent && hasPermission(role, "notifications.dispatch");
  function confirm() {
    const result = retryNotification({
      log,
      context: { ...context("notifications.dispatch", log.version), expectedVersion: review ?? -1 },
      now: operationsNow,
      dispatchedKeys: keys,
      reason,
      acknowledged: ack,
    });
    setFeedback(result);
    setLogs((current) => current.map((item) => (item.id === log.id ? result.log : item)));
    setKeys(result.dispatchedKeys);
    setReview(null);
    setAck(false);
  }
  function inspect() {
    const result = inspectSameProvider(log, context("notifications.read", log.version));
    setFeedback(result);
    setLogs((current) => current.map((item) => (item.id === log.id ? result.log : item)));
  }
  return (
    <>
      <OperationHeading
        title="Kirim ulang hanya bila memang aman."
        description="5 contoh log · In-App, Email dan WhatsApp · status pengiriman tidak menentukan RSVP."
      />
      {feedback && <Status tone={feedback.ok ? "success" : "danger"}>{feedback.message}</Status>}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <div className="grid min-w-0 content-start gap-5">
          <NotificationTable
            logs={logs}
            selected={selected}
            onSelect={(id) => {
              setSelected(id);
              setAck(false);
              setFeedback(null);
            }}
          />
          <OperationNote title="Persetujuan dan deduplikasi berlaku saat dispatch">
            Ulangi hanya kegagalan yang sudah dipastikan. Pesan terkirim, provider ambigu, penerima
            dicabut atau template tak sah tidak boleh dipaksa kirim.
          </OperationNote>
        </div>
        <Inspector
          title={`${log.id} · ${log.recipient}`}
          description={`${log.channel} personal · ${log.reason}`}
        >
          <ul className="grid gap-3 text-xs text-secondary">
            <li>{log.consent ? "✓ Izin valid pada pratinjau" : "× Izin penerima dicabut"}</li>
            <li>✓ Identitas penerima disamarkan</li>
            <li>
              {log.status === "failed"
                ? "✓ Backoff contoh sudah terlewati"
                : "Status terbaru wajib diperiksa"}
            </li>
            <li>Campaign key diperiksa ulang saat dispatch</li>
          </ul>
          <Field
            label="Alasan retry"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <CheckLine checked={ack} onChange={setAck}>
            Saya meninjau penerima dan status terbaru.
          </CheckLine>
          <Button
            disabled={!canRetry || !ack || reason.trim().length < 8}
            onClick={() => setReview(log.version)}
          >
            Jadwalkan ulang satu pesan
          </Button>
          {!canRetry && (
            <p className="text-xs text-secondary">
              {!hasPermission(role, "notifications.dispatch")
                ? "Scope Anda hanya membaca log."
                : "Status ini tidak memenuhi syarat retry."}
            </p>
          )}
          {log.status === "unknown" && (
            <Button variant="secondary" onClick={inspect}>
              Periksa provider · ID yang sama
            </Button>
          )}
          {log.status === "failed" && log.consent && (
            <Button
              variant="ghost"
              size="small"
              onClick={() =>
                setLogs((current) =>
                  current.map((item) =>
                    item.id === selected
                      ? {
                          ...item,
                          consent: false,
                          status: "canceled",
                          reason: "Izin dicabut saat antre",
                          version: item.version + 1,
                        }
                      : item,
                  ),
                )
              }
            >
              Simulasikan izin penerima dicabut
            </Button>
          )}
        </Inspector>
      </div>
      <Dialog
        open={review !== null}
        onClose={() => setReview(null)}
        title="Review satu pengiriman ulang"
      >
        <div className="grid gap-5">
          <p className="text-sm">
            {log.id} · {log.recipient} · versi {review}. Persetujuan, cooldown, deduplikasi dan
            versi diperiksa sekali lagi saat konfirmasi.
          </p>
          <p className="text-sm text-secondary">{reason}</p>
          <Status>Simulasi lokal. Jadwal diterima belum berarti pesan terkirim.</Status>
          <Button onClick={confirm}>Konfirmasi jadwal simulasi</Button>
        </div>
      </Dialog>
    </>
  );
}
