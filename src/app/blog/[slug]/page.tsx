import MarketingLayout from "@/modules/landing/layouts/marketing-layout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const placeholderPosts: Record<
  string,
  { title: string; date: string; body: string[] }
> = {
  "how-to-track-job-applications": {
    title: "How to track job applications without a spreadsheet",
    date: "Feb 8, 2025",
    body: [
      "Keeping track of dozens of applications across email threads is exhausting. Recruiters reply at different times, and it’s easy to lose track of who you’ve heard back from.",
      "Job Hound connects to your inbox and turns every application into a single record. When a recruiter replies, we update the status automatically—applied, interviewing, rejected, or offered. No copy-pasting into a spreadsheet.",
      "Connect your email once, and your dashboard stays in sync. You can still use your inbox as usual; we just read the threads that look like job-related replies and attach them to the right application.",
    ],
  },
  "staying-organized-job-search": {
    title: "Staying organized when you’re applying to 50+ roles",
    date: "Jan 28, 2025",
    body: [
      "Applying at scale means more noise: more replies, more threads, more “we’ve moved forward with other candidates” emails. The only way to stay sane is to have one place that shows the real state of your pipeline.",
      "Use statuses consistently: applied, interviewing, offered, rejected. That way you know exactly how many active conversations you have and where each one stands.",
      "A single dashboard beats scattered labels and folders. Job Hound gives you that: one list, one timeline per application, and a clear view of how your search is going.",
    ],
  },
  "what-recruiters-expect": {
    title: "What recruiters expect when they reply to your application",
    date: "Jan 15, 2025",
    body: [
      "Recruiters often reply within a few days to two weeks. Replies can be invitations to interview, rejections, or requests for more information. Missing a reply because it’s buried in your inbox can cost you an opportunity.",
      "Keeping every application in one place—with the full email thread attached—means you never have to dig for context. You see the latest reply and the full history at a glance.",
      "Job Hound keeps your pipeline clear so you can respond quickly and never lose track of a follow-up.",
    ],
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = placeholderPosts[slug];
  return {
    title: post ? `${post.title} | Job Hound Blog` : "Blog | Job Hound",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = placeholderPosts[slug];

  if (!post) {
    return (
      <MarketingLayout>
        <div className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Post not found
            </h1>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
          </div>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <article className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <header className="mb-10">
            <time
              dateTime={post.date}
              className="text-xs text-muted-foreground uppercase tracking-wider"
            >
              {post.date}
            </time>
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {post.title}
            </h1>
          </header>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {post.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
