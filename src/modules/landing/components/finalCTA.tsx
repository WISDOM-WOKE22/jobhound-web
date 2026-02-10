"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const router = useRouter();

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-2xl md:rounded-3xl border border-border/80 bg-foreground text-background px-6 py-12 md:px-12 md:py-16 shadow-lg">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Stop losing track of applications
          </h2>
          <p className="mt-4 text-background/80 text-sm md:text-base max-w-xl mx-auto">
            Connect your inbox. We’ll keep every application, interview, and offer in one place.
          </p>
          <div className="mt-8">
            <Button
              onClick={() => router.push("/home")}
              size="lg"
              variant="secondary"
              className="rounded-full px-8 font-medium bg-background text-foreground hover:bg-background/90"
            >
              Get started free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}