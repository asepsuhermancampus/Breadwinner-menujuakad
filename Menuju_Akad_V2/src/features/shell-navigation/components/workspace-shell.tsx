"use client";
import { useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { WorkspaceDock } from "./workspace-dock";
import { WorkspaceHeader } from "./workspace-header";
import styles from "./workspace-shell.module.css";

export function WorkspaceShell({
  children,
  name,
  memberships,
}: {
  children: ReactNode;
  name: string;
  memberships: { id: string; label: string; detail: string }[];
}) {
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  return (
    <div className={cn(styles.shell, compact && styles.shellCompact)}>
      <div className={styles.dockRegion}>
        <WorkspaceDock
          compact={compact}
          toggle={() => setCompact(!compact)}
          name={name}
          memberships={memberships}
        />
      </div>
      <div className={styles.canvas}>
        <WorkspaceHeader onOpenMenu={() => setMobile(true)} />
        <main id="main-content" className={styles.body}>
          {children}
        </main>
      </div>
      <Dialog open={mobile} onClose={() => setMobile(false)} title="Ruang rencana kalian" side>
        <WorkspaceDock
          compact={false}
          toggle={() => setMobile(false)}
          name={name}
          memberships={memberships}
          mobile
        />
      </Dialog>
    </div>
  );
}
