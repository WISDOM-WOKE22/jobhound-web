"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

const SYNC_STEPS = [
  "Fetching emails",
  "Scanning and formatting mails",
  "Processing mails",
  "Categorizing mails",
  "Adding status to validated mails",
  "Saving applications",
] as const;

const STEP_DURATION_MS = 50800;

export function IsMainSyncing() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= SYNC_STEPS.length - 1) return;
    const timer = window.setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, SYNC_STEPS.length - 1));
    }, STEP_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [currentStep]);

  const progressPercent = ((currentStep + 1) / SYNC_STEPS.length) * 100;

  return (
    <div
      className="flex flex-col items-center py-10 px-4 sm:py-14 sm:px-6 animate-in fade-in-0 duration-500"
      role="status"
      aria-live="polite"
      aria-label="Syncing your job applications"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Inbox className="h-7 w-7 sm:h-8 sm:w-8 text-primary" aria-hidden />
          </div>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Syncing your applications
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          We&apos;re reading your inbox and building your pipeline. Almost there.
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {SYNC_STEPS.length}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps card */}
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card/50 overflow-hidden">
        <ul className="divide-y divide-border list-none p-0 m-0">
          {SYNC_STEPS.map((label, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;
            const isPending = index > currentStep;

            return (
              <li
                key={label}
                className={cn(
                  "relative flex items-center gap-4 px-4 py-4 sm:px-5 sm:py-4 transition-all duration-300 ease-out",
                  isActive && "bg-primary/5",
                  isPending && "opacity-60"
                )}
              >
                {/* Step indicator */}
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isActive &&
                      "border-primary bg-primary/15 text-primary scale-105",
                    isPending &&
                      "border-muted-foreground/25 bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                  ) : isActive ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      strokeWidth={2}
                      aria-hidden
                    />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isComplete && "text-muted-foreground",
                    isActive && "font-medium text-foreground",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer note */}
      <div className="mt-8 flex items-center gap-2 rounded-xl bg-muted/40 border border-border/60 px-4 py-3">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
        <p className="text-xs text-muted-foreground">
          This usually takes under 5 minutes. Please don&apos;t close this page.
        </p>
      </div>
    </div>
  );
}
