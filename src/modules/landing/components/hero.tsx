"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/assets/svg";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const route = useRouter()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    addEventListener("mousemove", handleMouseMove);
    return () => removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative SVG grid */}
      <svg
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Gradient orbs that follow mouse */}
      <div
        className="pointer-events-none absolute -inset-40 blur-3xl"
        style={{
          background:
            "radial-gradient(600px at " +
            mousePosition.x +
            "px " +
            mousePosition.y +
            "px, rgba(17,24,39,0.25), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-32 blur-2xl"
        style={{
          background:
            "radial-gradient(400px at " +
            mousePosition.x / 1.3 +
            "px " +
            mousePosition.y / 1.3 +
            "px, rgba(99,102,241,0.25), transparent 60%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-5 max-w-6xl mx-auto mt-20">
        <div className="space-y-8 animate-fade-in mt-10 md:mt-0">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border-gray-500/50 bg-gray-900/10 backdrop-blur-sm border animate-fade-in-up">
            <span className="w-2 h-2 bg-gray-900 border border-gray-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">Unlock Your Full Learning Potential</span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl leading-tight animate-fade-in-up">
            <span className="block bg-gradient-to-r from-gray-900 via-gray-100 to-gray-900 bg-clip-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Track Every Job Application
            </span>
            <span className="block bg-gradient-to-r from-gray-900 via-gray-100 to-gray-900 bg-clip-text text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-10">
              With
            </span>
          </h1>
          <div className="flex justify-center items-center">
            <Logo className="w-80 h-40" />
          </div>

          {/* Description */}
          <p className="text max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
          Your inbox becomes a real-time job tracker — interviews, rejections, and offers updated for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 mt-20 lg:mt-40 animate-fade-in-up mb-30">
            <Button
              onClick={() => route.push('/home')}
              variant="outline"
              className="px-10 py-8 text-lg font-semibold rounded-full border-gray-900/30 hover:bg-gray-900/5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
        <div className="w-6 h-10 border-2 border-gray-900/30 dark:border-gray-500 rounded-full flex justify-center animate-bounce">
          <div className="w-1 h-3 bg-gray-900/60 dark:border-gray-500  rounded-full mt-2"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
