"use client";
import { useEffect, useState } from "react";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
export function useOptionalInstall() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [message, setMessage] = useState(
    "Bila browser mendukung, opsi pemasangan akan tersedia. Anda tetap bisa memakai bantuan melalui browser.",
  );
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    function available(event: Event) {
      event.preventDefault();
      setPrompt(event as InstallEvent);
    }
    function installed() {
      setMessage("Browser mengonfirmasi aplikasi terpasang.");
      setPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setMessage(
        choice.outcome === "accepted"
          ? "Permintaan diterima browser. Status pemasangan mengikuti konfirmasi browser."
          : "Pemasangan ditunda. Anda tetap dapat memakai bantuan di browser.",
      );
    } catch {
      setMessage("Browser tidak dapat membuka pemasangan. Gunakan menu browser bila tersedia.");
    }
    setPrompt(null);
  }
  return { available: Boolean(prompt), message, hidden, defer: () => setHidden(true), install };
}
