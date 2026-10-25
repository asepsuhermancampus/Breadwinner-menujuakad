"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
export function CustomerSignOut() {
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  return (
    <div>
      <button
        className="w-full rounded-control border border-ux-border px-4 py-2 text-left text-sm hover:bg-subtle"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          window.dispatchEvent(new Event("dashboard:signout-start"));
          try {
            await signOut({ redirectTo: "/dashboard" });
          } catch {
            window.dispatchEvent(new Event("dashboard:signout-cancel"));
            setError("Gagal keluar. Coba kembali.");
            setPending(false);
          }
        }}
      >
        {pending ? "Keluar…" : "Keluar"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
