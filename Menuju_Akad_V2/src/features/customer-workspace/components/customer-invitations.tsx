"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { SummaryCard } from "@/components/ui/summary-card";
import type { CustomerWorkspace } from "../types";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { InvitationEditor, type BasicInvitation } from "./invitation-editor";
import { CustomerInvitationCard } from "./customer-invitation-card";
import styles from "./customer-invitations.module.css";
import { LockedInvitationFeatures } from "./locked-invitation-features";
type State = {
  data: unknown[] | null;
  error: string;
  saving: boolean;
  save: (data: unknown[]) => Promise<boolean>;
  revision: number;
};
export function CustomerInvitations({ workspace }: { workspace: CustomerWorkspace }) {
  const state = useCustomerResource("invitations", workspace.id);
  return <Invitations workspace={workspace} state={state} />;
}
export function TrialInvitations({ workspace }: { workspace: CustomerWorkspace }) {
  const state = useTrialResource("invitations");
  return <Invitations workspace={workspace} state={state} trial />;
}
function Invitations({
  workspace,
  state,
  trial = false,
}: {
  workspace: CustomerWorkspace;
  state: State;
  trial?: boolean;
}) {
  const [creating, setCreating] = useState<BasicInvitation | null>(null);
  const current = state.data as BasicInvitation[] | null;
  const premium = trial || workspace.subscription.capabilities.includes("premium-templates"),
    multi = trial || workspace.subscription.capabilities.includes("multi-invitation");
  if (state.data === null && !state.error) {
    return <PageSkeleton variant="cards" label="Memuat undangan" />;
  }
  return (
    <section className="space-y-5">
      <header id="feature-premium-templates" tabIndex={-1} className={styles.header}>
        <PageHeading
          title="Undangan yang terasa personal."
          description="Pernikahan, lamaran, dan setiap momen yang ingin kalian bagi."
        />
        <Button
          disabled={!current || state.saving || (!multi && current.length >= 1)}
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
      {creating && (
        <InvitationEditor
          item={creating}
          workspaceId={workspace.id}
          premium={premium}
          trial={trial}
          onClose={() => setCreating(null)}
          save={(next) => {
            if (!current || (!multi && current.length >= 1)) return Promise.resolve(false);
            return state.save([...current, next]);
          }}
        />
      )}
      {current && (
        <section className={styles.metrics} aria-label="Ringkasan undangan">
          <SummaryCard label="Undangan" value={current.length} detail="Seluruh undangan kalian" />
          <SummaryCard
            label="Terbit"
            value={current.filter((item) => item.published).length}
            detail="Siap dibagikan kepada tamu"
            ornament={2}
          />
          <SummaryCard
            label="Draf"
            value={current.filter((item) => !item.published).length}
            detail="Undangan yang sedang disiapkan"
            ornament={3}
          />
        </section>
      )}
      {premium && (
        <Link
          id="feature-studio"
          href="/planner/invitations/studio"
          className="inline-block text-sm font-semibold underline"
        >
          Buka studio visual
        </Link>
      )}
      {!multi && (
        <p className="text-sm text-secondary">
          Satu undangan aktif. Lifetime menyediakan multi-undangan.
        </p>
      )}
      {state.error ? (
        <p role="alert" className="text-xs text-danger">
          {state.error}
        </p>
      ) : state.saving ? (
        <p role="status" className="text-xs text-secondary">
          Menyimpan…
        </p>
      ) : null}
      <div className={styles.grid}>
        {current?.map((item) => (
          <CustomerInvitationCard
            key={item.id}
            item={item}
            workspaceId={workspace.id}
            premium={premium}
            trial={trial}
            save={(next) => state.save(current.map((n) => (n.id === item.id ? next : n)))}
            remove={() => state.save(current.filter((n) => n.id !== item.id))}
          />
        ))}
      </div>
      {current?.length === 0 && (
        <div className="rounded-card border border-ux-border p-8">
          <h2 className="text-lg font-semibold">Cerita kalian dimulai di sini.</h2>
          <p className="mt-2 text-sm text-secondary">
            Tambahkan undangan pertama, lalu lengkapi nama, tanggal, dan tempat acara kalian.
          </p>
        </div>
      )}
      <div id="feature-multi-invitation" tabIndex={-1} className="text-sm text-secondary">
        {multi
          ? "Multi-undangan sudah terbuka; setiap acara mempunyai undangan tersendiri."
          : "Upgrade Lifetime untuk beberapa undangan."}
      </div>
      {(!premium || !multi) && <LockedInvitationFeatures premium={premium} multi={multi} />}
    </section>
  );
}
