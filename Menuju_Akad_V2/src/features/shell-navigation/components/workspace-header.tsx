"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CommandPalette } from "./command-palette";
import { WorkspaceAvatar } from "./workspace-avatar";
import styles from "./workspace-header.module.css";

export function WorkspaceHeader({
  onOpenMenu,
  name = "Ruang kalian",
  partnerName,
  photoUrl,
  partnerPhotoUrl,
  plan = "Free",
}: {
  onOpenMenu: () => void;
  name?: string;
  partnerName?: string | null;
  photoUrl?: string | null | undefined;
  partnerPhotoUrl?: string | null | undefined;
  plan?: string;
}) {
  const displayName = partnerName ? `${name} & ${partnerName}` : name;
  return (
    <header className={styles.topbar}>
      <Button
        variant="ghost"
        size="icon"
        className={styles.mobileMenu}
        aria-label="Buka navigasi"
        onClick={onOpenMenu}
      >
        <Icon name="panel-left-open" />
      </Button>
      <div className={styles.identity}>
        <span className={styles.avatars}>
          <WorkspaceAvatar name={name} photoUrl={photoUrl} />
          {partnerName && <WorkspaceAvatar name={partnerName} photoUrl={partnerPhotoUrl} />}
        </span>
        <div className={styles.identityCopy}>
          <strong>{displayName}</strong>
          <small>Ruang rencana bersama</small>
        </div>
      </div>
      <div className={styles.tools}>
        <CommandPalette />
        <Link href="/account/plans" className={`${styles.planLink} customer-control`}>
          <Icon name="sparkles" size={16} />
          {plan}
        </Link>
      </div>
    </header>
  );
}
