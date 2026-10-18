"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import { cn } from "@/lib/cn";
import type { AuthMode } from "../types/auth-contracts";
import styles from "./auth-layout.module.css";

export function AuthLayout({ mode, children }: { mode: AuthMode; children: ReactNode }) {
  const [document, setDocument] = useState<string | null>(null);
  const registered = mode !== "register";
  return (
    <div className={styles.layout}>
      <aside className={styles.editorial} aria-label="Menuju Akad">
        <div className={styles.photo}>
          <Image src="/assets/images/auth-editorial.png" alt="" fill sizes="44vw" priority />
        </div>
        <div className={cn(styles.plate, styles.brand)}>menuju akad</div>
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
          <span className={styles.mobileBrand}>menuju akad</span>
          <span>{registered ? "Baru di sini?" : "Sudah punya akun?"}</span>
          <Link href={`/auth/${registered ? "register" : "login"}`}>
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
          Dokumen legal produksi belum tersedia pada preview pengembangan ini. Jangan masukkan data
          pribadi atau kredensial nyata.
        </Status>
      </Dialog>
    </div>
  );
}
