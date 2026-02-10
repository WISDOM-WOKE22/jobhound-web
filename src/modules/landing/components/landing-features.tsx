"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, BarChart3, ListTodo, Inbox } from "lucide-react";

const features = [
  {
    icon: Inbox,
    title: "Inbox sync",
    description:
      "Connect your email once. Job Hound reads recruiter replies and keeps every application in sync—no spreadsheets.",
  },
  {
    icon: ListTodo,
    title: "Status at a glance",
    description:
      "See applied, interviewing, rejected, or offered in one place. Status updates automatically from your inbox.",
  },
  {
    icon: BarChart3,
    title: "Dashboard",
    description:
      "Track response rates and pipeline health. Know how many applications are active and where they stand.",
  },
  {
    icon: Mail,
    title: "Email timeline",
    description:
      "Every thread tied to an application. Open the full email thread and context without leaving the app.",
  },
];

export default function LandingFeatures() {
  return (
    <section
      id="features"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-labelledby="features-heading"
    >
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16 md:mb-20">
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground"
          >
            Built around your inbox
          </h2>
          <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Your job search, organized. We turn recruiter emails into a clear pipeline so you never lose track.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border/80 bg-card/50 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
            >
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-muted/50 text-muted-foreground">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
