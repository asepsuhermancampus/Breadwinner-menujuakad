"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import { onboardingHeadings, onboardingOrder } from "../config/onboarding-copy";
import type { OnboardingDraft, OnboardingStep, WorkspaceAdapter } from "../contracts";
import { useOnboardingDraft } from "../hooks/use-onboarding-draft";
import { eventErrors, profileErrors, type FormErrors } from "../utils/onboarding-validation";
import { EventsStep } from "./events-step";
import { OnboardingLayout } from "./onboarding-layout";
import { PartnerStep } from "./partner-step";
import { ProfileStep } from "./profile-step";

export function OnboardingScreen({
  step,
  initial,
  adapter,
}: {
  step: OnboardingStep;
  initial: OnboardingDraft;
  adapter: WorkspaceAdapter;
}) {
  const router = useRouter();
  const state = useOnboardingDraft(initial, adapter);
  const [errors, setErrors] = useState<FormErrors>({});
  const [discard, setDiscard] = useState(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  const navigating = useRef(false);
  const connected =
    state.draft.members.filter((member) => member.workspaceId === state.draft.workspaceId).length >=
      2 || state.draft.invite?.status === "used";
  const visibleStep = step === "success" && !connected ? "partner" : step;
  const [title, description] =
    onboardingHeadings[connected && visibleStep === "partner" ? "success" : visibleStep];
  const pending = state.status === "saving" || state.status === "loading";

  useEffect(() => {
    if (Object.keys(errors).length) {
      (
        document.querySelector<HTMLInputElement>('[aria-invalid="true"]') ?? errorSummary.current
      )?.focus();
    }
  }, [errors]);

  async function navigate(next: OnboardingStep) {
    if (navigating.current || pending) return;
    const forward = onboardingOrder.indexOf(next) > onboardingOrder.indexOf(step);
    const invalid = forward
      ? { ...profileErrors(state.draft), ...(next !== "events" ? eventErrors(state.draft) : {}) }
      : {};
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      return;
    }
    navigating.current = true;
    if (await state.save()) router.push(`/onboarding/${next}`);
    navigating.current = false;
  }

  async function finish() {
    if (navigating.current || pending) return;
    navigating.current = true;
    if (await state.save()) router.push("/account");
    navigating.current = false;
  }

  return (
    <OnboardingLayout
      step={visibleStep}
      onNavigate={(next) => {
        void navigate(next);
      }}
    >
      <div className="space-y-2">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.8px] md:text-[28px]">
          {title}
        </h1>
        <p className="text-sm leading-7 text-secondary">{description}</p>
      </div>
      {state.message && (
        <Status tone="danger">
          <p>{state.message} Input lokal tetap dipertahankan.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                void state.save();
              }}
            >
              Coba simpan lagi
            </Button>
            <Button variant="ghost" onClick={() => setDiscard(true)}>
              Muat versi terbaru
            </Button>
          </div>
        </Status>
      )}
      {Object.keys(errors).length > 0 && (
        <Status tone="danger">
          <div ref={errorSummary} tabIndex={-1}>
            <p>Periksa data sebelum melanjutkan.</p>
            <ul className="mt-2 list-inside list-disc">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          </div>
        </Status>
      )}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (visibleStep === "profile") void navigate("events");
          else if (visibleStep === "events") void navigate("partner");
          else void finish();
        }}
      >
        <fieldset disabled={pending} className="min-w-0 space-y-6">
          <legend className="sr-only">{title}</legend>
          {visibleStep === "profile" && (
            <ProfileStep
              draft={state.draft}
              adapter={adapter}
              errors={errors}
              onChange={state.update}
            />
          )}
          {visibleStep === "events" && (
            <EventsStep draft={state.draft} errors={errors} onChange={state.update} />
          )}
          {(visibleStep === "partner" || visibleStep === "success") && (
            <PartnerStep draft={state.draft} adapter={adapter} reload={state.reload} />
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {visibleStep === "profile" ? (
              <p role="status" className="text-xs text-secondary">
                {state.status === "dirty"
                  ? "Perubahan belum tersimpan"
                  : pending
                    ? "Menyimpan draf…"
                    : state.status === "error"
                      ? "Draf belum tersimpan"
                      : "✓ Draf tersimpan di perangkat ini"}
              </p>
            ) : (
              <Button
                variant="secondary"
                onClick={() => {
                  void navigate(visibleStep === "events" ? "profile" : "events");
                }}
              >
                Kembali
              </Button>
            )}
            <Button
              type="submit"
              variant={visibleStep === "partner" && !connected ? "ghost" : "primary"}
            >
              {pending
                ? "Mohon tunggu…"
                : visibleStep === "profile"
                  ? "Lanjut: rencana acara"
                  : visibleStep === "events"
                    ? "Lanjut: undang pasangan"
                    : connected
                      ? "Masuk ke ruang kita"
                      : "Lanjut sendiri untuk sekarang →"}
            </Button>
          </div>
        </fieldset>
      </form>
      <Dialog open={discard} onClose={() => setDiscard(false)} title="Muat draf terbaru?">
        <p className="text-sm leading-7 text-secondary">
          Perubahan lokal yang belum tersimpan akan dibuang. Draf terbaru akan dimuat dari
          penyimpanan preview.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDiscard(false)}>
            Lanjut edit
          </Button>
          <Button
            onClick={() => {
              setDiscard(false);
              void state.reload();
            }}
          >
            Muat draf terbaru
          </Button>
        </div>
      </Dialog>
    </OnboardingLayout>
  );
}
