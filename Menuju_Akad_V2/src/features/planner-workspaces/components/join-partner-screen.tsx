"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Status } from "@/components/ui/status";
import type { PartnerInvite, WorkspaceAdapter } from "../contracts";
import { inviteState } from "../utils/invite-policy";

export function JoinPartnerScreen({
  token,
  actorId,
  adapter,
}: {
  token: string;
  actorId: string;
  adapter: WorkspaceAdapter;
}) {
  const [invite, setInvite] = useState<PartnerInvite | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const lock = useRef(false);
  const [now, setNow] = useState(() => adapter.now());
  const state = invite ? inviteState(invite, now) : null;

  useEffect(() => {
    let active = true;
    adapter
      .getInvite(token)
      .then((result) => {
        if (active) {
          setInvite(result);
          setMessage("");
        }
      })
      .catch((error: unknown) => {
        if (active) setMessage(error instanceof Error ? error.message : "Tautan tidak tersedia.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const timer = window.setInterval(() => setNow(adapter.now()), 1_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [token, adapter]);

  async function redeem() {
    if (!invite || lock.current) return;
    lock.current = true;
    setLoading(true);
    setMessage("");
    try {
      const result = await adapter.redeemInvite(token, actorId);
      setInvite(result);
      setJoined(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Belum dapat bergabung. Coba lagi.");
    } finally {
      lock.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12">
      <Card className="w-full max-w-lg space-y-6 p-6 text-center md:p-10">
        <Link href="/" className="text-xl font-semibold text-primary">
          menuju akad
        </Link>
        <h1 className="font-serif text-[40px] leading-tight text-primary">
          {joined ? "Kalian sudah terhubung" : "Satu ruang untuk berdua"}
        </h1>
        <p className="text-sm leading-7 text-secondary">
          {joined
            ? "Akun pasangan ditambahkan pada ruang kerja dalam simulasi lokal."
            : "Terima undangan pasangan menggunakan akun simulasi terpisah. Ruang kerja lain tidak digabung otomatis."}
        </p>
        {message && <Status tone="danger">{message}</Status>}
        {state && state !== "pending" && !joined && (
          <Status tone="warning">
            Tautan{" "}
            {state === "expired"
              ? "kedaluwarsa"
              : state === "revoked"
                ? "sudah dicabut"
                : "sudah digunakan"}
            . Minta pemilik ruang membuat undangan baru.
          </Status>
        )}
        {loading && (
          <p role="status" className="text-sm text-secondary">
            Memproses simulasi lokal…
          </p>
        )}
        {invite && state === "pending" && !joined && (
          <Button
            className="w-full"
            disabled={loading}
            onClick={() => {
              void redeem();
            }}
          >
            Terima undangan simulasi
          </Button>
        )}
        <Link
          href={joined ? "/onboarding/success" : "/onboarding/partner"}
          className={buttonVariants({ variant: joined ? "primary" : "secondary" })}
        >
          {joined ? "Lihat ruang kita" : "Kembali ke undangan pasangan"}
        </Link>
        <p className="text-xs leading-6 text-secondary">
          Preview internal · Tidak mengirim pesan atau mengubah akun produksi.
        </p>
      </Card>
    </main>
  );
}
