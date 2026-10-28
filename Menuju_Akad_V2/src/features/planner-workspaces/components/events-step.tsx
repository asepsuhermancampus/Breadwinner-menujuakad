"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { EventKind, OnboardingDraft, PlanningScope } from "../contracts";
import { updateEvent, type FormErrors } from "../utils/onboarding-validation";
import { EventDetails } from "./event-details";

const choices = [
  {
    key: "engagement",
    label: "Acara Lamaran",
    description: "Awal ikatan dua keluarga",
    icon: "flower",
  },
  {
    key: "wedding",
    label: "Acara Pernikahan",
    description: "Menuju janji seumur hidup",
    icon: "flower-lotus",
  },
  { key: "both", label: "Keduanya", description: "Lamaran & pernikahan", icon: "heart" },
] as const;

export function EventsStep({
  draft,
  errors,
  onChange,
}: {
  draft: OnboardingDraft;
  errors: FormErrors;
  onChange: (updater: (draft: OnboardingDraft) => OnboardingDraft) => void;
}) {
  const [context, setContext] = useState<EventKind>("wedding");
  const active = draft.scope === "both" ? context : draft.scope;
  const kinds: EventKind[] = draft.scope === "both" ? ["engagement", "wedding"] : [draft.scope];

  function setScope(scope: PlanningScope) {
    onChange((current) => ({ ...current, scope }));
  }
  return (
    <Card className="space-y-6 p-5 md:p-7">
      <fieldset>
        <legend className="mb-4 text-sm font-semibold">Apa yang sedang kalian rencanakan?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {choices.map(({ key, label, description, icon }) => (
            <label
              key={key}
              className={cn(
                "relative flex min-h-32 cursor-pointer flex-col gap-3 rounded-2xl border p-[18px]",
                draft.scope === key ? "border-foreground bg-canvas" : "border-border bg-surface",
              )}
            >
              <span className="flex items-center justify-between gap-4">
                <Icon name={icon} size={26} className="text-brand-secondary" />
                <input
                  type="radio"
                  name="planning-scope"
                  value={key}
                  checked={draft.scope === key}
                  onChange={() => setScope(key)}
                  className="size-5 accent-primary"
                />
              </span>
              <span className="text-xs font-semibold">{label}</span>
              <span className="text-xs text-secondary">{description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 md:grid-cols-2">
        {kinds.map((kind) => (
          <Field
            key={kind}
            id={`${kind}-date`}
            type="date"
            label={`Tanggal ${kind === "engagement" ? "lamaran" : "pernikahan"}`}
            value={draft.events[kind].date}
            error={errors[`${kind}.date`]}
            className="font-mono"
            onChange={(event) =>
              onChange((current) => updateEvent(current, kind, { date: event.target.value }))
            }
          />
        ))}
      </div>
      {draft.scope === "both" && (
        <div
          className="flex flex-wrap items-center gap-2 border-t border-border pt-5"
          aria-label="Detail acara"
        >
          <span className="mr-auto text-xs text-secondary">Detail & anggaran untuk</span>
          {(["engagement", "wedding"] as const).map((kind) => (
            <Button
              key={kind}
              variant={active === kind ? "primary" : "ghost"}
              className="text-xs"
              aria-pressed={active === kind}
              onClick={() => setContext(kind)}
            >
              {kind === "engagement" ? "Lamaran" : "Pernikahan"}
            </Button>
          ))}
        </div>
      )}
      <EventDetails
        key={active}
        event={draft.events[active]}
        errors={errors}
        onChange={(patch) => onChange((current) => updateEvent(current, active, patch))}
      />
      <p className="flex items-start gap-2 text-xs leading-6 text-secondary">
        <Icon name="info" size={16} className="mt-1 shrink-0" />
        Lamaran & pernikahan punya anggaran dan checklist terpisah dalam satu ruang.
      </p>
    </Card>
  );
}
