"use client";

import Navbar from "../components/navbar";
import Hero from "../components/hero";
import LandingFeatures from "../components/landing-features";
import Contact from "../components/contact";
import { FinalCTA } from "../components/finalCTA";
import Footer from "../components/footer";
import { useEffect } from "react";
import { useAuthServices } from "../services";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { googleLogin } = useAuthServices();

    useEffect(() => {
        if (code) {
            googleLogin();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when OAuth code is present
    }, [code]);

  return (
    <main className="w-full relative min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <LandingFeatures />
      <Contact />
      <FinalCTA />
      <Footer />
    </main>
  );
}
