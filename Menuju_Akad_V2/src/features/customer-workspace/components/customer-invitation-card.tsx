"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InvitationEditor, type BasicInvitation } from "./invitation-editor";
import styles from "./customer-invitations.module.css";
type Props = {
  item: BasicInvitation;
  workspaceId: string;
  premium: boolean;
  trial: boolean;
  save: (next: BasicInvitation) => Promise<boolean>;
  remove: () => Promise<boolean>;
};
export function CustomerInvitationCard(props: Props) {
  const { item, workspaceId, trial, premium } = props;
  const [editing, setEditing] = useState(false);
  return (
    <article className={styles.card} data-published={Boolean(item.published)}>
      <div className={styles.summary}>
        <div className={styles.cover} aria-hidden="true">
          <span>THE WEDDING OF</span>
          <strong>
            {item.groom?.slice(0, 1) || "♡"} & {item.bride?.slice(0, 1) || "♡"}
          </strong>
          <span>MENUJU AKAD</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={styles.status}>{item.published ? "● TERBIT" : "DRAF · BELUM TERBIT"}</p>
          <h2 className={styles.title}>{item.title}</h2>
          <p className={styles.copy}>
            {[item.groom, item.bride].filter(Boolean).join(" & ") || "Lengkapi nama pasangan"}
          </p>
          <p className={styles.copy}>
            {[item.date, item.venue].filter(Boolean).join(" · ") || "Detail acara belum dilengkapi"}
          </p>
          <div className={styles.links}>
            {premium && (
              <Link href={`/planner/invitations/studio?project=${encodeURIComponent(item.id)}`}>
                Buka studio visual ↗
              </Link>
            )}
            {!trial && item.published && (
              <Link
                target="_blank"
                href={`/invitation/${item.id}?workspace=${encodeURIComponent(workspaceId)}`}
              >
                Lihat undangan ↗
              </Link>
            )}
          </div>
        </div>
      </div>
      <Button variant="secondary" onClick={() => setEditing(true)}>
        Kelola undangan
      </Button>
      {editing && <InvitationEditor {...props} onClose={() => setEditing(false)} />}
    </article>
  );
}
