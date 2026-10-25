import type { SubscriptionNotice, NoticeAction } from "../types";
export function advanceNotice(
  notice: SubscriptionNotice,
  action: NoticeAction,
  expectedStep: number,
): SubscriptionNotice {
  if (expectedStep !== notice.step || notice.state === "completed" || notice.state === "dismissed")
    return notice;
  if (action === "dismiss" || action === "complete")
    return { ...notice, state: action === "dismiss" ? "dismissed" : "completed" };
  if (action === "start")
    return { ...notice, state: notice.capabilities.length ? "started" : "completed" };
  if (notice.state !== "started") return notice;
  if (action === "next" && notice.step + 1 >= notice.capabilities.length)
    return { ...notice, state: "completed" };
  return {
    ...notice,
    step: Math.max(
      0,
      Math.min(notice.capabilities.length - 1, notice.step + (action === "next" ? 1 : -1)),
    ),
  };
}
