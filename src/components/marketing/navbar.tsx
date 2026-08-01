"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, LogIn, Menu, X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "../ui/button";

const primaryLinks = [
  {
    label: "Programmes",
    href: "/programmes",
  },
  {
    label: "Teachers",
    href: "/teachers",
  },
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Blog",
    href: "/blog",
  },
] as const;

const moreLinks = [
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;

type NavbarProps = {
  /**
   * Supply the actual authenticated state later from your marketing layout.
   */
  isAuthenticated?: boolean;
  portalHref?: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
  return <BrandLogo priority />;
}

export function Navbar({
  isAuthenticated = false,
  portalHref = "/portal",
}: NavbarProps) {
  const pathname = usePathname();
  const mobileMenuId = useId();
  const moreMenuId = useId();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  const accountHref = isAuthenticated ? portalHref : "/sign-in";
  const accountLabel = isAuthenticated ? "My portal" : "Sign in";

  const isMoreLinkActive = moreLinks.some(({ href }) =>
    isActivePath(pathname, href),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileOpen]);

  function closeMobileMenu() {
    setIsMobileOpen(false);
  }

  function handleMoreMouseLeave(event: ReactMouseEvent<HTMLDivElement>) {
    /**
     * Do not close the dropdown while keyboard focus remains inside it.
     */
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      moreMenuRef.current?.contains(nextTarget)
    ) {
      return;
    }

    setIsMoreOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow]",
        "duration-300",
        isScrolled || isMobileOpen
          ? "border-b border-primary/10 bg-background/90 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-background/70 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-18 w-full max-w-7xl items-center
          justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {primaryLinks.map(({ label, href }) => {
            const active = isActivePath(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 font-display text-[15px]",
                  "font-bold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-primary focus-visible:ring-offset-2",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}

          <div
            ref={moreMenuRef}
            className="relative"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={handleMoreMouseLeave}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isMoreOpen}
              aria-controls={moreMenuId}
              onClick={() => setIsMoreOpen((current) => !current)}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-2",
                "font-display text-[15px] font-bold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary focus-visible:ring-offset-2",
                isMoreOpen || isMoreLinkActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
              )}
            >
              More
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 transition-transform duration-200",
                  isMoreOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  id={moreMenuId}
                  role="menu"
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.16,
                    ease: "easeOut",
                  }}
                  className="absolute right-0 top-full w-60 pt-3"
                >
                  <div
                    className="grid gap-1 rounded-2xl border border-primary/10
                      bg-popover p-2 text-popover-foreground shadow-xl"
                  >
                    {moreLinks.map(({ label, href }) => {
                      const active = isActivePath(pathname, href);

                      return (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "rounded-xl px-3 py-2.5 text-sm font-semibold",
                            "transition-colors focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:ring-primary",
                            active
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-primary/10 hover:text-primary",
                          )}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button variant="ghost" asChild>
            <Link href={`${accountHref}`}>
              <LogIn data-icon="inline-start" />
              {accountLabel}
            </Link>
          </Button>

          {!isAuthenticated && (
            <Button asChild>
              <Link href="/enrolment">Enrol your child</Link>
            </Button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-label={
            isMobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMobileOpen}
          aria-controls={mobileMenuId}
          onClick={() => setIsMobileOpen((current) => !current)}
          className="grid size-11 shrink-0 place-items-center rounded-2xl
            bg-primary/10 text-primary transition-colors
            hover:bg-primary/15 focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-primary
            focus-visible:ring-offset-2 lg:hidden"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isMobileOpen ? "close" : "menu"}
              initial={{
                opacity: 0,
                rotate: -20,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 20,
                scale: 0.8,
              }}
              transition={{
                duration: 0.12,
              }}
            >
              {isMobileOpen ? (
                <X aria-hidden="true" className="size-6" />
              ) : (
                <Menu aria-hidden="true" className="size-6" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile navigation */}
      <AnimatePresence initial={false}>
        {isMobileOpen && (
          <motion.div
            id={mobileMenuId}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.25,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.18,
              },
            }}
            className="overflow-hidden border-t border-primary/10 bg-background
              lg:hidden"
          >
            <div
              className="mx-auto max-h-[calc(100dvh-72px)] max-w-7xl
                overflow-y-auto px-4 py-4 sm:px-6"
            >
              <div className="grid gap-1">
                {[...primaryLinks, ...moreLinks].map(
                  ({ label, href }, index) => {
                    const active = isActivePath(pathname, href);

                    return (
                      <motion.div
                        key={href}
                        initial={{
                          opacity: 0,
                          x: -8,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: Math.min(index * 0.025, 0.2),
                        }}
                      >
                        <Link
                          href={href}
                          onClick={closeMobileMenu}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-2xl px-4 py-3",
                            "font-display text-base font-bold",
                            "transition-colors focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:ring-primary",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/85 hover:bg-primary/10 hover:text-primary",
                          )}
                        >
                          {label}
                        </Link>
                      </motion.div>
                    );
                  },
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4">
                <Button variant="ghost" asChild>
                  <Link href={`${accountHref}`}>
                    <LogIn data-icon="inline-start" />
                    {accountLabel}
                  </Link>
                </Button>

                {!isAuthenticated && (
                  <Button asChild>
                    <Link href="/enrolment">Enrol your child</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
