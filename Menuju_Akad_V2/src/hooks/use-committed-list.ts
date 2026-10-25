"use client";
import { useRef, useState, type SetStateAction } from "react";
export function useCommittedList<T>(
  initial: T[],
  save?: (items: T[]) => void | Promise<boolean | void>,
) {
  const [local, setItems] = useState(initial);
  const items = save ? initial : local;
  const busy = useRef(false);
  async function update(action: SetStateAction<T[]>): Promise<boolean> {
    if (busy.current) return false;
    busy.current = true;
    try {
      const next = typeof action === "function" ? action(items) : action;
      if ((await save?.(next)) === false) return false;
      setItems(next);
      return true;
    } finally {
      busy.current = false;
    }
  }
  return [items, update] as const;
}
