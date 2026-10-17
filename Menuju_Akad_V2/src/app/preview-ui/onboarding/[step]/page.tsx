import { notFound } from "next/navigation";
import { PreviewOnboarding } from "@/preview/components/preview-onboarding";

export default async function OnboardingPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (step !== "profile" && step !== "events" && step !== "partner" && step !== "success")
    notFound();
  return <PreviewOnboarding step={step} />;
}
