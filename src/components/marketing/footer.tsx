import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

const footerLinks = {
  explore: [
    {
      label: "Programmes",
      href: "/programmes",
    },
    {
      label: "Subjects",
      href: "/subjects",
    },
    {
      label: "Teachers",
      href: "/teachers",
    },
    {
      label: "Success Stories",
      href: "/success-stories",
    },
    {
      label: "Events",
      href: "/events",
    },
  ],

  resources: [
    {
      label: "Parent Resources",
      href: "/parent-resources",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "FAQs",
      href: "/faqs",
    },
    {
      label: "Gallery",
      href: "/gallery",
    },
    {
      label: "Child Safety",
      href: "/child-safety",
    },
  ],

  company: [
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Careers",
      href: "/careers",
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms of Use",
      href: "/terms",
    },
  ],
} as const;

const socialLinks = [
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim(),
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim(),
    icon: FaFacebook,
  },
  {
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim(),
    icon: FaLinkedin,
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE?.trim(),
    icon: FaYoutube,
  },
].filter(
  (item): item is { label: string; href: string; icon: typeof FaInstagram } =>
    Boolean(item.href),
);

type FooterLinkGroupProps = {
  title: string;
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
};

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="font-display text-base font-extrabold text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex text-sm font-medium text-white/70
                transition-colors hover:text-white focus-visible:rounded-sm
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/70 focus-visible:ring-offset-4
                focus-visible:ring-offset-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLogo() {
  return <BrandLogo inverse imageClassName="size-14" />;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim();
  const contactAddress = process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim();
  const phoneHref = contactPhone?.replace(/[^+\d]/g, "");

  return (
    <footer className="relative mt-24">
      {/* CTA panel */}
      <div className="relative z-10 mx-auto -mb-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[2rem] bg-primary
            px-6 py-9 shadow-xl sm:px-10 sm:py-11 lg:px-14"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 size-64 rounded-full
              bg-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-[35%] size-52 rounded-full
              bg-turquoise/25"
          />

          <div
            className="relative flex flex-col items-start justify-between
              gap-7 lg:flex-row lg:items-center"
          >
            <div className="max-w-2xl">
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full
                  bg-white/15 px-3 py-1.5 text-sm font-bold text-white"
              >
                Help your child thrive
              </div>

              <h2
                className="font-display text-3xl font-extrabold leading-tight
                  tracking-tight text-white sm:text-4xl"
              >
                Ready to make learning feel exciting again?
              </h2>

              <p className="mt-3 max-w-120 text-sm leading-6 text-white/80 sm:text-base">
                Join a supportive learning community where every child receives
                the guidance, confidence and attention they need to grow.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                variant="cream"
                size="lg"
                className="w-full border-white/20 bg-white text-foreground
                  hover:bg-white/90 sm:w-auto"
                asChild
              >
                <Link href="/enrolment">
                  Enrol your child
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/35 bg-transparent text-white
                  hover:border-white/60 hover:bg-white/10 hover:text-white
                  sm:w-auto"
                asChild
              >
                <Link href="/contact">Talk to our team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div
        className="relative overflow-hidden bg-foreground pb-8 pt-32
          text-white"
      >

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="grid gap-12 border-b border-white/10 pb-12
              md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr]"
          >
            {/* Brand and contact */}
            <div className="max-w-md">
              <FooterLogo />

              <p className="mt-5 text-sm leading-7 text-white/65">
                Helping children discover their strengths through engaging,
                personalised and confidence-building learning experiences.
              </p>

              {(contactEmail || contactPhone || contactAddress) && (
                <div className="mt-6 space-y-3">
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="group flex w-fit items-start gap-3 rounded-md
                        text-sm text-white/70 transition-colors hover:text-white
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-white/70"
                    >
                      <span
                        className="mt-0.5 grid size-8 shrink-0 place-items-center
                          rounded-full bg-white/10 text-primary transition-colors
                          group-hover:bg-primary group-hover:text-white"
                      >
                        <Mail aria-hidden="true" className="size-4" />
                      </span>
                      <span className="pt-1.5">{contactEmail}</span>
                    </a>
                  )}

                  {contactPhone && phoneHref && (
                    <a
                      href={`tel:${phoneHref}`}
                      className="group flex w-fit items-start gap-3 rounded-md
                        text-sm text-white/70 transition-colors hover:text-white
                        focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-white/70"
                    >
                      <span
                        className="mt-0.5 grid size-8 shrink-0 place-items-center
                          rounded-full bg-white/10 text-coral transition-colors
                          group-hover:bg-coral group-hover:text-white"
                      >
                        <Phone aria-hidden="true" className="size-4" />
                      </span>
                      <span className="pt-1.5">{contactPhone}</span>
                    </a>
                  )}

                  {contactAddress && (
                    <div className="flex items-start gap-3 text-sm text-white/70">
                      <span
                        className="mt-0.5 grid size-8 shrink-0 place-items-center
                          rounded-full bg-white/10 text-turquoise"
                      >
                        <MapPin aria-hidden="true" className="size-4" />
                      </span>
                      <span className="max-w-60 pt-1.5 leading-6">
                        {contactAddress}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <FooterLinkGroup title="Explore" links={footerLinks.explore} />

            <FooterLinkGroup title="Resources" links={footerLinks.resources} />

            <FooterLinkGroup title="Company" links={footerLinks.company} />
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col gap-6 pt-7 sm:flex-row
              sm:items-center sm:justify-between"
          >
            <p className="text-center text-sm text-white/55 sm:text-left">
              © {currentYear} Three-D Managers Limited. All rights reserved.
            </p>

            {socialLinks.length > 0 && (
              <div className="flex items-center justify-center gap-2 sm:justify-end">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={cn(
                    "grid size-10 place-items-center rounded-full",
                    "border border-white/10 bg-white/5 text-white/70",
                    "transition-[transform,background-color,color,border-color]",
                    "hover:-translate-y-0.5 hover:border-primary/40",
                    "hover:bg-primary hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-white/70 focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
