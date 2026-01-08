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
    } else {
      router.push(href);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Only render when open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-16 md:hidden z-40 bg-background border-t border-border shadow-lg"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="mx-auto max-w-6xl px-4 py-6">
            <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="w-full text-left px-4 py-3 text-base font-medium text-foreground rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                onClick={() => {
                  login();
                }}
                disabled={isLoading}
                variant={scrolled ? "default" : "outline"}
                size="lg"
                className="w-full rounded-full cursor-pointer"
              >
                {isLoading ? <Spinner className="size-4 animate-spin" /> : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
