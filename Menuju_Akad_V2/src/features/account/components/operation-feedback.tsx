import { Status } from "@/components/ui/status";

export function OperationFeedback({
  feedback,
}: {
  feedback: { message: string; failed: boolean } | null;
}) {
  if (!feedback) return null;
  return <Status tone={feedback.failed ? "danger" : "success"}>{feedback.message}</Status>;
}
