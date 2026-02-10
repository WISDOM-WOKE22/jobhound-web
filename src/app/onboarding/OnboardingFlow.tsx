"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthServices } from "@/modules/landing/services";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMainStore } from "@/lib/zustand/store";

const STATUS_OPTIONS = [
  { id: "applied", label: "Applied", description: "New applications you've submitted", value: "applied" },
  { id: "application_received", label: "Application received", description: "Confirmation that your application was received", value: "application_received" },
  { id: "under_review", label: "Under review", description: "When companies are reviewing your application", value: "under_review" },
  { id: "shortlisted", label: "Shortlisted", description: "You're on the shortlist for the role", value: "shortlisted" },
  { id: "recruiter_screen", label: "Recruiter screen", description: "Initial recruiter call or screening", value: "recruiter_screen" },
  { id: "phone_screen", label: "Phone screen", description: "Phone or video screening interviews", value: "phone_screen" },
  { id: "hiring_manager_review", label: "Hiring manager review", description: "Under review by the hiring manager", value: "hiring_manager_review" },
  { id: "interviewing", label: "Interviewing", description: "Interviews and recruiter conversations", value: "interviewing" },
  { id: "interview_scheduled", label: "Interview scheduled", description: "An interview has been scheduled", value: "interview_scheduled" },
  { id: "interview_completed", label: "Interview completed", description: "You've completed an interview round", value: "interview_completed" },
  { id: "final_round_interview", label: "Final round", description: "Final-stage interviews", value: "final_round_interview" },
  { id: "assessment", label: "Assessment", description: "Tests, assignments, or take-homes", value: "assessment" },
  { id: "offer", label: "Offer", description: "Offers and negotiation updates", value: "offer" },
  { id: "rejected", label: "Rejected", description: "Rejections so you can close the loop", value: "rejected" },
  { id: "application_on_hold", label: "On hold", description: "Application paused or on hold", value: "application_on_hold" },
] as const;

const VALID_VALUES = new Set<string>(STATUS_OPTIONS.map((o) => o.value));
const REQUIRED_COUNT = 3;

function filterValidTags(tags: string[] | undefined): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((t): t is string => typeof t === "string" && VALID_VALUES.has(t));
}

export default function OnboardingFlow() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { user } = useMainStore();
  const {
    getOnboardingStatus,
    isOnboarding,
    updateUserOnboarding,
  } = useAuthServices();

  const toggle = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : prev.length >= REQUIRED_COUNT
          ? [...prev.slice(0, -1), value]
          : [...prev, value]
    );
  }, []);

  const canContinue = selected.length === REQUIRED_COUNT;

  // Load profile on mount
  useEffect(() => {
    getOnboardingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Pre-fill from user.focusedTags and redirect if already onboarded
  useEffect(() => {
    if (isOnboarding || !user) return;
    const tags = filterValidTags(user.focusedTags);
    if (user.isOnBoarded && tags.length >= REQUIRED_COUNT) {
      router.replace("/home");
      return;
    }
    if (!hasInitialized && tags.length > 0) {
      setSelected(tags.slice(0, REQUIRED_COUNT));
      setHasInitialized(true);
    } else if (!hasInitialized) {
      setHasInitialized(true);
    }
  }, [user, isOnboarding, hasInitialized]);

  const handleContinue = useCallback(async () => {
    if (!canContinue) return;
    setIsSubmitting(true);
    try {
      await updateUserOnboarding(selected);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "jobhound_follow_up_statuses",
          JSON.stringify(selected)
        );
      }
      router.push("/home");
    } catch {
      // Error already toasted in updateUserOnboarding
    } finally {
      setIsSubmitting(false);
    }
  }, [canContinue, selected, updateUserOnboarding, router]);

  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8">
        <header className="shrink-0 animate-in fade-in-0 duration-500 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Which statuses matter most to you?
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Choose {REQUIRED_COUNT}. We&apos;ll keep these at the top of your mind.
          </p>
        </header>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain sm:mt-8">
          <ScrollArea className="grid gap-3 pb-2 sm:gap-4 max-h-[500px]">
            {STATUS_OPTIONS.map((option, index) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggle(option.value)}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className={cn(
                    "group relative flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-200 ease-out sm:gap-5 sm:px-5 sm:py-5 mt-4",
                    "animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-backwards",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "active:scale-[0.99]",
                    isSelected
                      ? "border-foreground/25 bg-muted/50 shadow-sm"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-7 sm:w-7",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-muted-foreground/40 bg-transparent group-hover:border-muted-foreground/60"
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </ScrollArea>
        </div>

        <div className="mt-6 shrink-0 flex flex-col gap-4 border-t border-border pt-6 sm:mt-8 sm:pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {selected.length} of {REQUIRED_COUNT} selected
          </p>
          <Button
            size="lg"
            disabled={!canContinue || isSubmitting || isOnboarding}
            onClick={handleContinue}
            className="h-12 w-full rounded-full text-base font-medium transition-all sm:h-14 sm:text-lg cursor-pointer"
          >
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
