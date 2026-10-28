"use client";
import { useUrlTab } from "@/hooks/use-url-tab";
type Panel = "sections" | "layers" | "assets" | "motion" | "resilience";
export function useStudioNavigation() {
  const [mode, setMode] = useUrlTab("mode", ["visual", "form"], "visual");
  const [panel, setPanel] = useUrlTab<Panel>(
    "panel",
    ["sections", "layers", "assets", "motion", "resilience"],
    "sections",
  );
  const [mobile, setMobile] = useUrlTab(
    "mobile-tab",
    ["content", "canvas", "inspector"],
    "content",
  );
  return { mode, setMode, panel, setPanel, mobile, setMobile };
}
