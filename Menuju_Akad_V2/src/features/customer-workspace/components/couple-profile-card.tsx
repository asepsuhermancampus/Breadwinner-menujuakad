"use client";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { CardOrnament } from "@/components/ui/card-ornament";
import type { CustomerWorkspace } from "../types";
import { PartnerPhotoField } from "./partner-photo-field";
import styles from "./profile-portraits.module.css";
import visuals from "./couple-profile-card.module.css";
export function CoupleProfileCard({
  slot,
  title,
  workspace,
  name,
  nickname,
  photo,
  disabled,
  photoDisabled,
  setName,
  setNickname,
  photoChanged,
  side,
  setSide,
}: {
  slot: "owner" | "partner";
  title: string;
  workspace: CustomerWorkspace;
  name: string;
  nickname: string;
  photo: string | null;
  disabled: boolean;
  photoDisabled: boolean;
  setName: (value: string) => void;
  setNickname: (value: string) => void;
  photoChanged: (value: string | null) => void;
  side: string;
  setSide: (value: string) => void;
}) {
  const own = slot === (workspace.role === "owner" ? "owner" : "partner");
  const locked = slot === "partner" && workspace.partnerAccess?.state !== "connected";
  return (
    <section
      className={`${styles.card} ${locked ? visuals.lockedCard : ""}`}
      aria-label={title}
      data-profile-slot={slot}
    >
      <CardOrnament variant={own ? 1 : 3} />
      <h2>{title}</h2>
      <PartnerPhotoField
        title={own ? "Anda" : "pasangan"}
        value={photo}
        disabled={photoDisabled}
        changed={photoChanged}
      />
      <Field
        label={own ? "Nama lengkap" : "Nama lengkap pasangan"}
        name={own ? "fullName" : "partnerName"}
        value={name}
        autoComplete={own ? "name" : "off"}
        maxLength={160}
        required={own}
        disabled={disabled}
        onChange={(event) => setName(event.target.value)}
      />
      <Field
        label={own ? "Nama panggilan" : "Nama panggilan pasangan"}
        name={own ? "nickname" : "partnerNickname"}
        value={nickname}
        autoComplete={own ? "nickname" : "off"}
        maxLength={60}
        required={own}
        disabled={disabled}
        onChange={(event) => setNickname(event.target.value)}
      />
      <Select
        label={own ? "Posisi Anda" : "Posisi pasangan"}
        value={slot === "owner" ? side : side ? (side === "groom" ? "bride" : "groom") : ""}
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;
          setSide(slot === "owner" ? value : value === "groom" ? "bride" : "groom");
        }}
      >
        <option value="" disabled>
          {own ? "Pilih posisi Anda" : "Pilih posisi pasangan"}
        </option>
        <option value="groom">Pasangan pria</option>
        <option value="bride">Pasangan wanita</option>
      </Select>
      {locked && (
        <div className={visuals.lockOverlay}>
          <span role="img" aria-label="Profil pasangan terkunci">
            <Icon name="lock" size={30} />
          </span>
          <span className="sr-only">Profil pasangan belum terhubung</span>
        </div>
      )}
    </section>
  );
}
