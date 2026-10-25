"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { reviewRequest } from "../lib/review-request";

export function SuperadminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      await reviewRequest("/api/superadmin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.replace("/superadmin/reviews");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Belum dapat masuk.");
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <main
      id="main-content"
      className="flex min-h-dvh items-center justify-center bg-ux-shell px-5 py-12"
    >
      <div className="w-full max-w-md rounded-shell border border-ux-border bg-surface p-6 shadow-sm sm:p-9">
        <Link href="/" className="text-sm font-semibold text-primary">
          menuju akad.
        </Link>
        <div className="mt-9 flex size-12 items-center justify-center rounded-card bg-ux-soft text-primary">
          <ShieldCheck size={25} strokeWidth={1.4} aria-hidden="true" />
        </div>
        <p className="mt-5 text-xs font-semibold tracking-widest text-rose uppercase">
          Ruang superadmin
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-primary">Mendengar, lalu bertumbuh.</h1>
        <p className="mt-3 text-sm leading-7 text-secondary">
          Masuk untuk membaca masukan pengguna dan memilih cerita yang ingin Anda bagikan.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-5" aria-busy={busy}>
          <Field
            label="Email superadmin"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            disabled={busy}
            required
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            maxLength={128}
            disabled={busy}
            required
          />
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Memeriksa…" : "Masuk ke ruang ulasan"}
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </form>
        <p className="mt-6 text-xs leading-6 text-secondary">
          Akses khusus pengelola. Ulasan yang belum dipublikasikan tetap privat.
        </p>
      </div>
    </main>
  );
}
