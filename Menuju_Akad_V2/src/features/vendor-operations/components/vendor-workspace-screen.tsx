"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVendorWorkspace } from "../hooks/use-vendor-workspace";
import { VendorCatalog } from "./vendor-catalog";
import { VendorKyb } from "./vendor-kyb";
import { VendorOrders } from "./vendor-orders";
import { VendorCalendar } from "./vendor-calendar";
import { VendorWallet } from "./vendor-wallet";
import { VendorScenarios } from "./vendor-scenarios";
import { VendorShell } from "./vendor-shell";
import type { VendorView } from "./vendor-dock";
import { OperationalFeedback } from "./operational-feedback";

export function VendorWorkspaceScreen() {
  const editor = useVendorWorkspace();
  const [view, setView] = useState<VendorView>("catalog");
  const [next, setNext] = useState<VendorView | null>(null);
  const [kybDirty, setKybDirty] = useState(false);
  const dirty = editor.dirty || kybDirty || editor.storageError;
  useEffect(() => {
    function unload(event: BeforeUnloadEvent) {
      if (dirty) event.preventDefault();
    }
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [dirty]);
  function navigate(value: VendorView) {
    if (value === view) return;
    if (editor.dirty || kybDirty) setNext(value);
    else setView(value);
  }
  function proceed() {
    if (!next) return;
    editor.discard();
    setKybDirty(false);
    setView(next);
    setNext(null);
  }
  const props = { state: editor.state, context: editor.context, onResult: editor.onResult };
  return (
    <VendorShell view={view} onNavigate={navigate} name={editor.state.catalog.profile.name}>
      {!editor.ready ? (
        <div role="status" className="grid gap-5 py-8">
          <p>Memuat katalog vendor…</p>
          <div className="h-11 animate-pulse rounded-control bg-subtle" />
          <div className="h-64 rounded-card bg-subtle" />
        </div>
      ) : (
        <>
          {view === "catalog" && (
            <VendorCatalog
              draft={editor.draft}
              onChange={editor.setDraft}
              onSave={() => void editor.save()}
              onKyb={() => navigate("kyb")}
              busy={editor.busy}
              dirty={editor.dirty}
              canEdit={
                editor.context.role === "vendor" &&
                editor.context.sessionValid &&
                editor.context.permissions.catalogWrite
              }
              errors={editor.errors}
            />
          )}
          {view === "kyb" && <VendorKyb {...props} onDirtyChange={setKybDirty} />}
          {view === "orders" && <VendorOrders {...props} />}
          {view === "calendar" && <VendorCalendar {...props} />}
          {view === "wallet" && <VendorWallet {...props} />}
          {editor.message && (
            <p
              role="status"
              className="rounded-control border border-ux-border bg-canvas p-4 text-sm leading-relaxed"
            >
              {editor.message}
            </p>
          )}
          {!editor.context.online && <OperationalFeedback kind="offline" />}
          {!editor.context.sessionValid && <OperationalFeedback kind="revoked" />}
          <VendorScenarios
            context={editor.context}
            onChange={editor.environment}
            onRefresh={editor.refreshVersion}
          />
        </>
      )}
      <Dialog open={next !== null} title="Perubahan belum disimpan" onClose={() => setNext(null)}>
        <p className="text-sm leading-relaxed text-secondary">
          Draf katalog atau dokumen privat belum dikirim. Lanjutkan mengedit, atau abaikan draf
          sebelum berpindah bagian.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setNext(null)}>
            Lanjutkan edit
          </Button>
          {!kybDirty && editor.dirty && (
            <Button
              disabled={editor.busy}
              onClick={async () => {
                if (await editor.save()) {
                  setView(next!);
                  setNext(null);
                }
              }}
            >
              Simpan katalog & lanjut
            </Button>
          )}
          <Button variant="danger" onClick={proceed}>
            Abaikan draf & lanjut
          </Button>
        </div>
      </Dialog>
    </VendorShell>
  );
}
