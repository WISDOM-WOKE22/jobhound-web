import { Suspense } from "react";
import OnboardingFlow from "./OnboardingFlow";

export const metadata = {
  title: "Choose your focus | Job Hound",
  description:
    "Select the application statuses you want to follow up with most.",
};

function OnboardingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center animate-pulse">
      <div className="w-full max-w-lg h-96 bg-muted/50 rounded-xl" />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingFallback />}>
      <OnboardingFlow />
    </Suspense>
  );
}
