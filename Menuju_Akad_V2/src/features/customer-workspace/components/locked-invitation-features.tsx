"use client";
import { FeatureLock } from "./feature-lock";
import { InvitationEditor } from "./invitation-editor";
export function LockedInvitationFeatures({ premium, multi }: { premium: boolean; multi: boolean }) {
  const editor = (
    <InvitationEditor
      item={{ id: "locked", title: "", template: "premium" }}
      premium
      trial={false}
      workspaceId=""
      save={async () => false}
      remove={async () => false}
    />
  );
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {!premium && (
        <FeatureLock title="Template Premium">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Template Premium</h2>
            {editor}
          </div>
        </FeatureLock>
      )}
      {!multi && (
        <FeatureLock title="Multi-undangan" plan="Lifetime">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Undangan acara berikutnya</h2>
            {editor}
          </div>
        </FeatureLock>
      )}
    </div>
  );
}
