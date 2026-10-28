"use client";

import Link from "next/link";
import { useSyncExternalStore, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { AuthMode } from "../types/auth-contracts";
import styles from "./auth-layout.module.css";
import { browserReturnTo } from "../lib/return-to";
const subscribeLocation = (change: () => void) => {
  window.addEventListener("popstate", change);
  return () => window.removeEventListener("popstate", change);
};

export function AuthLayout({
  mode,
  children,
  initialReturnTo = "",
}: {
  mode: AuthMode;
  children: ReactNode;
  initialReturnTo?: string;
}) {
  const [document, setDocument] = useState<string | null>(null);
  const registered = mode !== "register";
  const returnTo = useSyncExternalStore(subscribeLocation, browserReturnTo, () => initialReturnTo);
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <main
          id="main-content"
          className={`${styles.main}${mode === "login" ? ` ${styles.compact}` : ""}`}
        >
          <Link href="/" className={styles.brand} aria-label="Menuju Akad">
            <BrandLogo variant="cypress" width={44} height={21} className="object-contain" />
          </Link>
          <div className={styles.form}>{children}</div>
          <header className={styles.header}>
            <span>{registered ? "Baru di sini?" : "Sudah punya akun?"}</span>
            <Link
              href={`/auth/${registered ? "register" : "login"}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
            >
              {registered ? "Buat akun" : "Masuk"}
            </Link>
          </header>
        </main>
        <footer className={styles.footer}>
          <span>© 2026 Menuju Akad</span>
          <div className={styles.legal}>
            <button type="button" onClick={() => setDocument("Kebijakan Privasi")}>
              Privasi
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={() => setDocument("Syarat & Ketentuan")}>
              Syarat & Ketentuan
            </button>
          </div>
        </footer>
      </div>
      <Dialog
        open={document !== null}
        onClose={() => setDocument(null)}
        title={document ?? "Informasi"}
      >
        <Status>
          Data akun disimpan untuk menyediakan akses ke rencana kalian. Password disimpan sebagai
          hash dan tidak ditampilkan kembali. Login Google mengikuti persetujuan akun Google kalian.
          Ulasan yang dikirim diperiksa superadmin sebelum ditampilkan kepada publik.
        </Status>
      </Dialog>
    </div>
  );
}
