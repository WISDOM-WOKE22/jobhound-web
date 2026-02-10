import MarketingLayout from "@/modules/landing/layouts/marketing-layout";
import BlogContent from "@/modules/landing/components/blog-content";

export const metadata = {
  title: "Blog | Job Hound",
  description:
    "Tips and updates on job search, inbox organization, and Job Hound.",
};

export default function BlogPage() {
  return (
    <MarketingLayout>
      <BlogContent />
    </MarketingLayout>
  );
}
