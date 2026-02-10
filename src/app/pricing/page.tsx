import MarketingLayout from "@/modules/landing/layouts/marketing-layout";
import PricingContent from "@/modules/landing/components/pricing-content";

export const metadata = {
  title: "Pricing | Job Hound",
  description:
    "Simple pricing for Job Hound. Start free, upgrade when you need more.",
};

export default function PricingPage() {
  return (
    <MarketingLayout>
      <PricingContent />
    </MarketingLayout>
  );
}
