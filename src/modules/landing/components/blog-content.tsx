"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "how-to-track-job-applications",
    title: "How to track job applications without a spreadsheet",
    excerpt:
      "Keep every application, reply, and interview in one place by connecting your inbox to Job Hound.",
    date: "Feb 8, 2025",
  },
  {
    slug: "staying-organized-job-search",
    title: "Staying organized when you’re applying to 50+ roles",
    excerpt:
      "Tips on managing volume: labels, statuses, and why a single dashboard beats scattered threads.",
    date: "Jan 28, 2025",
  },
  {
    slug: "what-recruiters-expect",
    title: "What recruiters expect when they reply to your application",
    excerpt:
      "Understanding reply patterns and how to keep your pipeline clear so you never miss a follow-up.",
    date: "Jan 15, 2025",
  },
];

export default function BlogContent() {
  return (
    <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 md:mb-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Blog
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            Tips and updates on job search, inbox organization, and Job Hound.
          </p>
        </header>

        <ul className="space-y-6 list-none p-0 m-0">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <Card className="border-border/80 bg-card/50 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80">
                  <CardContent className="pt-6 pb-6">
                    <time
                      dateTime={post.date}
                      className="text-xs text-muted-foreground uppercase tracking-wider"
                    >
                      {post.date}
                    </time>
                    <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:underline underline-offset-2">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                      Read more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
