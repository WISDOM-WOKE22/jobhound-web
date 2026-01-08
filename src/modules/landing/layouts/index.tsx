"use client";

import Navbar from "../components/navbar";
import Hero from "../components/hero";
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
    }, [code]);
  return (
    <main className="w-full relative">
      <Navbar />
      <Hero />
    </main>
  );
}
