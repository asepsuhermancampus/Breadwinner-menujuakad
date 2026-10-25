"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { CustomerWorkspace } from "../types";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import type { BasicInvitation } from "./invitation-editor";
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
  const current = state.data as BasicInvitation[] | null;
  const premium = trial || workspace.subscription.capabilities.includes("premium-templates"),
    multi = trial || workspace.subscription.capabilities.includes("multi-invitation");
  return (
    <section className="space-y-5">
      <header id="feature-premium-templates" tabIndex={-1} className={styles.header}>
        <div>
          <h1 className={styles.heading}>Undangan yang terasa personal.</h1>
          <p className="mt-2 text-sm text-secondary">
            Pernikahan, lamaran, dan setiap momen yang ingin kalian bagi.
          </p>
        </div>
        <Button
          disabled={!current || state.saving || (!multi && current.length >= 1)}
          onClick={() =>
            void state.save([
              ...(current ?? []),
              {
                id: crypto.randomUUID(),
                title: "Undangan baru",
                template: "basic",
                published: false,
              },
            ])
          }
        >
          Tambah undangan
        </Button>
      </header>
      <dl className={styles.metrics}>
        <div>
          <dt>Undangan</dt>
          <dd>{current?.length ?? "—"}</dd>
        </div>
        <div>
          <dt>Terbit</dt>
          <dd>{current ? current.filter((item) => item.published).length : "—"}</dd>
        </div>
        <div>
          <dt>Draf</dt>
          <dd>{current ? current.filter((item) => !item.published).length : "—"}</dd>
        </div>
      </dl>
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
      <p role="status" className="text-xs text-secondary">
        {state.saving
          ? "Menyimpan…"
          : state.error ||
            (trial ? "Draf tersimpan di browser ini." : "Perubahan tersimpan di akun kalian.")}
      </p>
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
