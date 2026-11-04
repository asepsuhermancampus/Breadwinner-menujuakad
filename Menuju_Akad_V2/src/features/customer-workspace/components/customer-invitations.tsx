"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import type { CustomerWorkspace } from "../types";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { InvitationEditor, type BasicInvitation } from "./invitation-editor";
import { CustomerInvitationCard } from "./customer-invitation-card";
import { TemplateCatalogView } from "./template-catalog-view";
import type { VidingTemplate } from "../types/viding-template";
import styles from "./customer-invitations.module.css";
import { useFeatureAvailability } from "./feature-availability-context";

type State = {
  data: unknown[] | null;
  error: string;
  saving: boolean;
  save: (data: unknown[]) => Promise<boolean>;
  revision: number;
};

export function CustomerInvitations({
  workspace,
  studioAvailable = true,
}: {
  workspace: CustomerWorkspace;
  studioAvailable?: boolean;
}) {
  const state = useCustomerResource("invitations", workspace.id, true, true);
  return <Invitations workspace={workspace} state={state} studioAvailable={studioAvailable} />;
}

export function TrialInvitations({
  workspace,
  studioAvailable = true,
}: {
  workspace: CustomerWorkspace;
  studioAvailable?: boolean;
}) {
  const state = useTrialResource("invitations");
  return (
    <Invitations workspace={workspace} state={state} trial studioAvailable={studioAvailable} />
  );
}

function Invitations({
  workspace,
  state,
  trial = false,
  studioAvailable,
}: {
  workspace: CustomerWorkspace;
  state: State;
  trial?: boolean;
  studioAvailable: boolean;
}) {
  const [creating, setCreating] = useState<BasicInvitation | null>(null);
  const effectiveStudio = useFeatureAvailability()?.["studio-drafts"] ?? studioAvailable;
  const current = state.data as BasicInvitation[] | null;
  const premium = trial || workspace.subscription.capabilities.includes("premium-templates");
  const multi = trial || workspace.subscription.capabilities.includes("multi-invitation");
  const canAdd = Boolean(current) && !state.saving && (multi || (current ? current.length < 1 : true));

  const handleSelectTemplate = (template: VidingTemplate) => {
    setCreating({
      id: crypto.randomUUID(),
      title: `Undangan ${template.name}`,
      template: template.name,
      published: false,
    });
  };

  return (
    <section className="space-y-6">
      <header id="feature-premium-templates" tabIndex={-1} className={styles.header}>
        <PageHeading
          title="Template Undangan Digital"
          description="167+ pilihan tema pernikahan eksklusif terinspirasi dari viding.co. Lihat pratinjau langsung dan gunakan tema pilihan kalian."
        />
        <Button
          disabled={!canAdd}
          onClick={() =>
            setCreating({
              id: crypto.randomUUID(),
              title: "Undangan baru",
              template: "basic",
              published: false,
            })
          }
        >
          Tambah undangan
        </Button>
      </header>

      {state.error && (
        <div className="rounded-card border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700" role="alert">
          {state.error}
        </div>
      )}

      {current === null && !state.error && (
        <div className="rounded-card border border-ux-border bg-surface p-4 text-xs text-secondary animate-pulse" role="status">
          Memuat daftar undangan kalian...
        </div>
      )}

      {creating && (
        <InvitationEditor
          item={creating}
          workspaceId={workspace.id}
          premium={premium}
          trial={trial}
          onClose={() => setCreating(null)}
          save={(next) => {
            const list = current ?? [];
            if (!multi && list.length >= 1) return Promise.resolve(false);
            return state.save([...list, next]);
          }}
        />
      )}

      {current && current.length > 0 && (
        <section className="rounded-card border border-ux-border bg-surface p-5 space-y-4" aria-label="Undangan aktif">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Undangan Aktif Kalian ({current.length})</h2>
              <p className="text-xs text-secondary">Kelola draf, sunting detail, atau terbitkan undangan kalian.</p>
            </div>
          </div>
          <div className={styles.grid}>
            {current.map((item) => (
              <CustomerInvitationCard
                key={item.id}
                item={item}
                workspaceId={workspace.id}
                premium={premium}
                studioAvailable={effectiveStudio}
                trial={trial}
                save={(next) => state.save(current.map((n) => (n.id === item.id ? next : n)))}
                remove={() => state.save(current.filter((n) => n.id !== item.id))}
              />
            ))}
          </div>
        </section>
      )}

      <TemplateCatalogView onSelectTemplate={handleSelectTemplate} canSelect={canAdd} />
    </section>
  );
}
