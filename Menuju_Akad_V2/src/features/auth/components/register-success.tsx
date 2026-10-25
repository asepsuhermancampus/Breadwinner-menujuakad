"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { browserReturnTo } from "../lib/return-to";

export function RegisterSuccess() {
  const router = useRouter();
  const [href, setHref] = useState("/login?registered=1");
  useEffect(() => {
    const target = `/login?registered=1&returnTo=${encodeURIComponent(browserReturnTo())}`;
    const timer = setTimeout(() => router.replace(target), 3000);
    const update = setTimeout(() => setHref(target), 0);
    return () => {
      clearTimeout(timer);
      clearTimeout(update);
    };
  }, [router]);
  return (
    <div className="space-y-4 rounded-card border border-ux-border bg-surface p-5">
      <p role="status" className="font-semibold">
        Pendaftaran berhasil. Silakan masuk dengan email dan password kalian.
      </p>
      <p className="text-sm text-secondary">
        Kalian akan diarahkan ke halaman login dalam beberapa detik.
      </p>
      <Link href={href} className="font-semibold underline">
        Masuk sekarang
      </Link>
    </div>
  );
}
