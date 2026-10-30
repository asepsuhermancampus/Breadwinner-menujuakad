"use client";

import styles from "./studio-navigation.module.css";

export function StudioNavigation({
  onExit,
  invitationsAvailable = true,
}: {
  onExit: () => void;
  invitationsAvailable?: boolean;
}) {
  return (
    <nav className={styles.tabs} aria-label="Fitur undangan" data-customer-tabs>
      <button
        type="button"
        onClick={onExit}
        aria-label={invitationsAvailable ? "Kembali ke daftar undangan" : "Kembali ke ringkasan"}
      >
        {invitationsAvailable ? "Undangan" : "Ringkasan"}
      </button>
      <span aria-current="page">Studio visual</span>
    </nav>
  );
}
