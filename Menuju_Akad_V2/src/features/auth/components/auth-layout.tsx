"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/cn";
import type { AuthMode } from "../types/auth-contracts";
import styles from "./auth-layout.module.css";
import { browserReturnTo } from "../lib/return-to";
const subscribeLocation = (change: () => void) => {
  window.addEventListener("popstate", change);
  return () => window.removeEventListener("popstate", change);
};
const serverReturnTo = () => "";

export function AuthLayout({ mode, children }: { mode: AuthMode; children: ReactNode }) {
  const [document, setDocument] = useState<string | null>(null);
  const registered = mode !== "register";
  const returnTo = useSyncExternalStore(subscribeLocation, browserReturnTo, serverReturnTo);
  return (
    <div className={styles.layout}>
      <aside className={styles.editorial} aria-label="Menuju Akad">
        <div className={styles.photo}>
          <Image src="/assets/images/auth-editorial.png" alt="" fill sizes="44vw" priority />
        </div>
        <div className={cn(styles.plate, styles.brand, "flex items-center gap-2.5")}>
          <BrandLogo variant="ivory" width={40} height={19} className="object-contain" />
          <span>menuju akad</span>
        </div>
        <div className={cn(styles.plate, styles.quote)}>
          <h2>
            Hari besar kalian,
            <br />
            lebih mudah direncanakan.
          </h2>
          <p>Satu ruang untuk setiap langkah menuju akad.</p>
        </div>
      </aside>
      <div className={styles.content}>
        <header className={styles.header}>
          <span className={cn(styles.mobileBrand, "flex items-center gap-2")}>
            <BrandLogo variant="cypress" width={32} height={15} className="object-contain" />
            <span className="font-semibold text-primary">menuju akad</span>
          </span>
          <span>{registered ? "Baru di sini?" : "Sudah punya akun?"}</span>
          <Link
            href={`/auth/${registered ? "register" : "login"}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}
          >
            {registered ? "Buat akun" : "Masuk"}
          </Link>
        </header>
        <main id="main-content" className={styles.main}>
          <div className={styles.form}>{children}</div>
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
