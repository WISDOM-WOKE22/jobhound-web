import Link from "next/link";
import { Logo } from "@/assets/svg";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-muted/30"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md w-fit"
              aria-label="Job Hound home"
            >
              <Logo className="h-8 w-8 sm:h-9 sm:w-9 text-foreground" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Track every job application from your inbox. No spreadsheets.
            </p>
          </div>

          {/* Link columns */}
          <nav
            className="flex flex-wrap gap-x-8 gap-y-6 sm:gap-x-12"
            aria-label="Footer navigation"
          >
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product
              </span>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </span>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Legal
              </span>
              <ul className="flex flex-col gap-2 list-none p-0 m-0">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Job Hound. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <FooterLink href="mailto:hello@jobhound.com">hello@jobhound.com</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
