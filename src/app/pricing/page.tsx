import { Suspense } from "react";
import MarketingLayout from "@/modules/landing/layouts/marketing-layout";
import PricingContent from "@/modules/landing/components/pricing-content";

export const metadata = {
  title: "Pricing | Job Hound",
  description:
    "Simple pricing for Job Hound. Start free, upgrade when you need more.",
};

function PricingFallback() {
  return (
    <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-4xl mx-auto h-96 bg-muted/50 rounded-lg" />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingFallback />}>
      <MarketingLayout>
        <PricingContent />
      </MarketingLayout>
    </Suspense>
  );
}
