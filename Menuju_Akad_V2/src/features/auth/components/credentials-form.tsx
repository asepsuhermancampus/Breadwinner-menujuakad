"use client";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { SecretField } from "./secret-field";
import { browserAuthDestination } from "../lib/return-to";
import { RegisterSuccess } from "./register-success";
export function CredentialsForm({ register = false }: { register?: boolean }) {
  const router = useRouter();
  const [registered, setRegistered] = useState(false);
  const [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget,
      data = new FormData(form);
    const email = String(data.get("email") ?? ""),
      secret = String(data.get("password") ?? "");
    setPending(true);
    setError("");
    try {
      const identity = await fetch("/api/reviews/identity", { cache: "no-store" });
      if (!identity.ok) throw new Error("Sesi browser belum siap. Silakan coba lagi.");
      if (register) {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email,
            password: secret,
            confirmation: data.get("confirmation"),
            consent: data.get("consent") === "on",
          }),
        });
        const body = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(body.error ?? "Akun belum dapat dibuat.");
        setPassword("");
        setConfirmation("");
        form.reset();
        setRegistered(true);
        return;
      }
      const result = await signIn("credentials", { email, password: secret, redirect: false });
      if (!result?.ok || result.error)
        throw new Error(
          "Email atau password tidak sesuai, atau terlalu banyak percobaan. Silakan coba kembali.",
        );
      const Credential = (
        window as unknown as { PasswordCredential?: new (form: HTMLFormElement) => Credential }
      ).PasswordCredential;
      if (Credential && navigator.credentials) {
        try {
          void navigator.credentials.store(new Credential(form)).catch(() => undefined);
        } catch {
          /* Browser fallback uses autocomplete. */
        }
      }
      router.replace(browserAuthDestination());
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Belum dapat masuk.");
      setPending(false);
    }
  }
  if (registered) return <RegisterSuccess />;
  return (
    <form
      name={register ? "register" : "login"}
      method="post"
      onSubmit={(event) => void submit(event)}
      className="grid gap-4"
      aria-busy={pending}
    >
      {register && (
        <Field
          name="name"
          label="Nama lengkap"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          disabled={pending}
        />
      )}
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        required
        maxLength={254}
        readOnly={pending}
      />
      <SecretField
        kind="password"
        name="password"
        label="Password"
        value={password}
        onChange={setPassword}
        readOnly={pending}
        autoComplete={register ? "new-password" : "current-password"}
      />
      {register && (
        <>
          <p className="text-xs text-secondary">
            Gunakan 12–128 karakter. Kalimat sandi diperbolehkan.
          </p>
          <SecretField
            kind="password"
            name="confirmation"
            label="Konfirmasi password"
            value={confirmation}
            onChange={setConfirmation}
            readOnly={pending}
            autoComplete="new-password"
          />
          <label className="flex items-start gap-2 text-xs leading-5">
            <input name="consent" type="checkbox" required className="mt-1" disabled={pending} />
            Saya setuju membuat akun dan menyimpan data akun untuk menggunakan Menuju Akad.
          </label>
        </>
      )}
      {error && <Status tone="danger">{error}</Status>}
      <Button type="submit" disabled={pending}>
        {pending ? "Memproses…" : register ? "Buat akun" : "Masuk"}
      </Button>
      {!register && (
        <p className="text-xs leading-5 text-secondary">
          Browser dapat menawarkan penyimpanan password dan pengisian otomatis saat kalian masuk
          kembali.
        </p>
      )}
    </form>
  );
}
