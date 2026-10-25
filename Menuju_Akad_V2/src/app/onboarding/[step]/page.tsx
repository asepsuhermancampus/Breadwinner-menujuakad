import { notFound, redirect } from "next/navigation";
export default async function OnboardingPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!["profile", "events", "partner", "success"].includes(step)) notFound();
  redirect(
    step === "events" ? "/planner/calendar" : step === "success" ? "/dashboard" : "/account",
  );
}
