import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingValues } from "./landing-values";
import { LandingPlannerPreview } from "./landing-planner-preview";
import { LandingWorkflow } from "./landing-workflow";
import { LandingInvitations } from "./landing-invitations";
import { LandingPricing } from "./landing-pricing";
import { LandingFaq } from "./landing-faq";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";
import { ReviewSection } from "@/features/reviews/components/review-section";

export function LandingScreen() {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <LandingNav />
      <main id="main-content">
        <LandingHero />
        <LandingValues />
        <LandingPlannerPreview />
        <LandingWorkflow />
        <LandingInvitations />
        <LandingPricing />
        <ReviewSection />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
