import { Suspense } from "react";
import HomeLayout from "@/modules/landing/layouts";

function HomeFallback() {
  return (
    <main className="w-full relative min-h-screen">
      <div className="animate-pulse h-screen bg-muted/30" />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeLayout />
    </Suspense>
  );
}
