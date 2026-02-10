"use client";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full relative min-h-screen scroll-smooth flex flex-col">
      <Navbar />
      <main className="pt-20 md:pt-24 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
