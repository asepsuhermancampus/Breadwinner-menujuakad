"use client";

import styles from "./studio-navigation.module.css";

export function StudioNavigation({ onExit }: { onExit: () => void }) {
  return (
    <nav className={styles.tabs} aria-label="Fitur undangan" data-customer-tabs>
      <button type="button" onClick={onExit} aria-label="Kembali ke daftar undangan">
        Undangan
      </button>
      <span aria-current="page">Studio visual</span>
    </nav>
  );
}
