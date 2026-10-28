"use client";
import { useState } from "react";
import Image from "next/image";
export function WorkspaceAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl?: string | null | undefined;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  return (
    <span data-header-avatar>
      {photoUrl && failed !== photoUrl ? (
        <Image
          src={photoUrl}
          alt={`Foto ${name}`}
          width={48}
          height={48}
          unoptimized
          onError={() => setFailed(photoUrl)}
        />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </span>
  );
}
