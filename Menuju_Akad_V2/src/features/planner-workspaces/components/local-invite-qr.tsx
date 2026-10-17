"use client";

import { useEffect, useState } from "react";
import { Status } from "@/components/ui/status";
import { localInvitePath } from "../utils/invite-policy";

export function LocalInviteQr({ token }: { token: string }) {
  const [dataUrl, setDataUrl] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import("qrcode")
      .then((qr) =>
        qr.toDataURL(`${window.location.origin}${localInvitePath(token)}`, {
          width: 288,
          margin: 1,
          color: { dark: "#1E3F32", light: "#FFFFFF" },
        }),
      )
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (failed)
    return <Status tone="warning">QR belum tersedia. Gunakan tautan lokal di bawah.</Status>;
  return (
    <div className="flex size-36 items-center justify-center bg-subtle">
      {dataUrl ? (
        // The generated data URI encodes this origin's local preview route.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          width={144}
          height={144}
          alt="QR tautan simulasi pasangan pada perangkat ini"
        />
      ) : (
        <span role="status" className="text-xs text-secondary">
          Menyiapkan QR…
        </span>
      )}
    </div>
  );
}
