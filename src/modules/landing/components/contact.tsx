"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/60"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-xl mx-auto">
        <header className="text-center mb-12 md:mb-14">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-muted-foreground mb-4">
            <Mail className="h-5 w-5" aria-hidden />
          </div>
          <h2
            id="contact-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
          >
            Get in touch
          </h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Questions or feedback? We’d love to hear from you.
          </p>
        </header>

        {submitted ? (
          <div className="rounded-xl border border-border/80 bg-muted/30 px-6 py-8 text-center">
            <p className="text-foreground font-medium">Thanks for reaching out.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We’ll get back to you as soon as we can.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-border/80 bg-card/30 p-6 md:p-8 backdrop-blur-sm"
          >
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                className="rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="How can we help?"
                rows={4}
                className="rounded-lg resize-none"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full font-medium"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" aria-hidden />
              Send message
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Or email us at{" "}
          <a
            href="mailto:hello@jobhound.com"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            hello@jobhound.com
          </a>
        </p>
      </div>
    </section>
  );
}
