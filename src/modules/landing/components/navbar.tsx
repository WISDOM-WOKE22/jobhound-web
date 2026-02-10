"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/assets/svg";
import { cn } from "@/lib/utils";
import { useAuthServices } from "../services";
import { Spinner } from "@/components/ui/spinner";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, isLoading, error, success } = useAuthServices();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Close mobile menu when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const handleLinkClick = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (href.startsWith("/#") && typeof window !== "undefined") {
      const id = href.slice(2);
      if (window.location.pathname === "/" && id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Contact", href: "/#contact" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 dark:bg-background/90">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
            aria-label="Go to homepage"
          >
            <Logo className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:rotate-12" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => login()}
                disabled={isLoading}
              variant={scrolled ? "default" : "outline"}
              size="default"
              className={cn(
                "rounded-full transition-all duration-200 cursor-pointer",
                scrolled && "shadow-md"
              )}
            >
              {isLoading ? <Spinner className="size-4 animate-spin" /> : "Get Started"}
            </Button>
          </div>

          {/* Mobile Menu Button - visible only below md */}
          <button
            type="button"
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-50 md:hidden h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background shadow-lg transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mx-auto max-w-6xl px-4 py-6">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleLinkClick(link.href)}
                className="w-full text-left px-4 py-3.5 text-base font-medium text-foreground rounded-xl transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              onClick={() => login()}
              disabled={isLoading}
              variant="default"
              size="lg"
              className="w-full rounded-full cursor-pointer"
            >
              {isLoading ? <Spinner className="size-4 animate-spin" /> : "Get Started"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
