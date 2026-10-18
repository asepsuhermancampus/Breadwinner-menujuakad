"use client";

import { CheckinConsoleScreen } from "@/features/check-in/components/checkin-console-screen";

export function PreviewCheckinConsole() {
  return (
    <CheckinConsoleScreen initialTotalRsvp={340} initialValidated={214} initialRemaining={126} />
  );
}
