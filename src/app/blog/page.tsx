import { Suspense } from "react";
import MarketingLayout from "@/modules/landing/layouts/marketing-layout";
import BlogContent from "@/modules/landing/components/blog-content";

export const metadata = {
  title: "Blog | Job Hound",
  description:
    "Tips and updates on job search, inbox organization, and Job Hound.",
};

function BlogFallback() {
  return (
    <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-3xl mx-auto h-64 bg-muted/50 rounded-lg" />
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogFallback />}>
      <MarketingLayout>
        <BlogContent />
      </MarketingLayout>
    </Suspense>
  );
}
