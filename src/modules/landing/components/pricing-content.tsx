"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Free",
    description: "Get started and keep your job search organized.",
    price: "$0",
    period: "forever",
    features: [
      "Connect one email account",
      "Unlimited applications tracked",
      "Status updates from inbox",
      "Email timeline per application",
      "Dashboard overview",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For serious job seekers who apply at scale.",
    price: "$9",
    period: "/month",
    features: [
      "Everything in Free",
      "Multiple email accounts",
      "Priority email sync",
      "Export to CSV",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
];

export default function PricingContent() {
  const router = useRouter();

  return (
    <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16 md:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Simple pricing
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Start free. Upgrade when you need more accounts or priority sync.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 md:gap-6 lg:max-w-4xl lg:mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col border-border/80 bg-card/50 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80 ${
                tier.highlighted
                  ? "ring-2 ring-foreground/10 dark:ring-foreground/20 md:-mt-2 md:mb-2"
                  : ""
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-foreground/80" />
              )}
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {tier.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col pt-0">
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check
                        className="h-4 w-4 shrink-0 text-foreground mt-0.5"
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => router.push("/home")}
                  className="mt-8 w-full rounded-full font-medium"
                  variant={tier.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          No credit card required for Free. Cancel Pro anytime.
        </p>
      </div>
    </div>
  );
}
