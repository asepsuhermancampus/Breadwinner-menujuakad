"use client";

import { MicrositeScreen } from "@/features/guest-experience/components/microsite-screen";
import { PreviewNotice } from "./preview-notice";

export function PreviewMicrosite() {
  return (
    <>
      <PreviewNotice />
      <MicrositeScreen />
    </>
  );
}
