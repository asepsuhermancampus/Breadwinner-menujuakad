"use client";
import { useUrlSearch } from "@/hooks/use-url-tab";
export function useFinanceLocation() {
  return new URLSearchParams(useUrlSearch());
}
