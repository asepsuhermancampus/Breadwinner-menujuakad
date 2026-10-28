"use client";
import { useId, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardOrnament } from "@/components/ui/card-ornament";
import type { CustomerWorkspace } from "../types";
import { PartnerAccess } from "./partner-access";
import { CoupleProfileCard } from "./couple-profile-card";
import { ProfileAccessConnector } from "./profile-access-connector";
import { useProfileDraft } from "../hooks/use-profile-draft";
import styles from "@/features/account/components/account.module.css";
import visuals from "./customer-settings.module.css";
import portraits from "./profile-portraits.module.css";
const subscribe = () => () => {};
const readyClient = () => true;
const readyServer = () => false;
export function CustomerProfile({ workspace }: { workspace: CustomerWorkspace }) {
  const ready = useSyncExternalStore(subscribe, readyClient, readyServer);
  const profileFormId = useId();
  const profile = useProfileDraft(workspace);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const order = ["owner", "partner"] as const;
  function title(slot: "owner" | "partner") {
    if (!workspace.ownerSide)
      return slot === (workspace.role === "owner" ? "owner" : "partner")
        ? "Profil Anda"
        : "Profil pasangan";
    const side =
      slot === "owner" ? workspace.ownerSide : workspace.ownerSide === "groom" ? "bride" : "groom";
    return side === "bride" ? "Profil pasangan wanita" : "Profil pasangan pria";
  }
  return (
    <div className={portraits.layout}>
      <form
        id={profileFormId}
        className={`${styles.stack} ${portraits.profileForm}`}
        onSubmit={async (event) => {
          event.preventDefault();
          if (pending || !profile.dirty) return;
          setPending(true);
          setMessage("");
          try {
            const response = await fetch("/api/workspace", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(profile.body()),
            });
            const body = (await response.json()) as {
              error?: string;
              workspace?: CustomerWorkspace;
            };
            if (!response.ok || !body.workspace)
              throw new Error(body.error ?? "Profil belum tersimpan");
            profile.saved(body.workspace);
            router.refresh();
          } catch (cause) {
            setMessage(cause instanceof Error ? cause.message : "Profil gagal disimpan");
          } finally {
            setPending(false);
          }
        }}
      >
        <div className={portraits.cards}>
          {order.map((slot) => (
            <CoupleProfileCard
              key={slot}
              slot={slot}
              title={title(slot)}
              workspace={workspace}
              name={profile.draft[slot].fullName}
              nickname={profile.draft[slot].nickname}
              photo={profile.photo(slot)}
              disabled={
                !ready ||
                pending ||
                (slot === "partner" && workspace.partnerAccess?.state !== "connected")
              }
              photoDisabled={
                !ready ||
                pending ||
                (slot === "partner" && workspace.partnerAccess?.state !== "connected")
              }
              setName={(value) => profile.update(slot, "fullName", value)}
              setNickname={(value) => profile.update(slot, "nickname", value)}
              photoChanged={(value) => profile.setPhoto(slot, value)}
              side={profile.draft.ownerSide}
              setSide={profile.setSide}
            />
          ))}
        </div>
      </form>
      <div className={portraits.profileFooter}>
        <p className={portraits.hint}>
          Nama panggilan dan foto digunakan pada header serta fitur perencanaan. Simpan perubahan
          setelah selesai mengatur profil kalian.
        </p>
        {message && (
          <p role="alert" className="text-sm text-danger">
            {message}
          </p>
        )}
        <div className={styles.actions}>
          <Button
            type="submit"
            form={profileFormId}
            disabled={pending || !profile.dirty}
            className={portraits.saveButton}
          >
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </div>
      </div>
      <aside className={portraits.support}>
        <section
          className={`${styles.panel} ${visuals.accessCard}`}
          aria-label="Akses pasangan"
          data-partner-access-card
        >
          <CardOrnament variant={2} />
          <h2>Akses pasangan</h2>
          <PartnerAccess workspace={workspace} />
        </section>
      </aside>
      <ProfileAccessConnector connected={workspace.partnerAccess?.state === "connected"} />
    </div>
  );
}
