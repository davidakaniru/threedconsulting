"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";

import { useLogout } from "@/hooks/auth/use-logout";
import {
  findPortalNavigationItem,
  isPortalNavigationItemActive,
  portalNavigation,
} from "@/config/portal-navigation";
import { cn } from "@/lib/utils";
import type { AuthenticatedUser, UserRole } from "@/types/auth";

const roleStyles: Record<
  UserRole,
  { label: string; soft: string; text: string; solid: string }
> = {
  admin: {
    label: "Admin portal",
    soft: "bg-primary/10",
    text: "text-primary",
    solid: "bg-primary",
  },
  teacher: {
    label: "Teacher portal",
    soft: "bg-orange-50",
    text: "text-orange-600",
    solid: "bg-orange-500",
  },
  parent: {
    label: "Parent portal",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    solid: "bg-emerald-600",
  },
};

function SidebarContent({
  user,
  onNavigate,
}: {
  user: AuthenticatedUser;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const meta = roleStyles[user.role];

  return (
    <aside
      className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5"
      aria-label="Portal navigation"
    >
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Three-D Managers Limited public website"
      >
        <Image
          src="/brand/threed-consulting.jpeg"
          alt="Three-D Managers Limited"
          width={44}
          height={44}
          className="size-11 rounded-2xl bg-white object-contain"
          priority
        />
        <span className="min-w-0">
          <span className="block truncate font-display text-lg font-extrabold leading-none text-slate-950">
            ThreeD
          </span>
          <span className={cn("mt-1 block text-xs font-bold", meta.text)}>
            {meta.label}
          </span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1" aria-label="Primary portal navigation">
        {portalNavigation[user.role].map((item) => {
          const Icon = item.icon;
          const active = isPortalNavigationItemActive(
            pathname,
            item,
            user.role,
          );
          if (!item.enabled) {
            return (
              <div
                key={item.href}
                title="Coming soon"
                className="flex cursor-not-allowed items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-300"
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] font-extrabold uppercase tracking-wider">
                  Soon
                </span>
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors",
                active
                  ? cn(meta.soft, meta.text)
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-[#fff8eb] p-4">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl text-white",
            meta.solid,
          )}
        >
          <CircleHelp className="size-5" />
        </span>
        <p className="mt-3 font-display text-sm font-extrabold text-slate-950">
          Need a hand?
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Our support team is here Monday–Saturday.
        </p>
        <Link
          href="/contact"
          onClick={onNavigate}
          className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:underline"
        >
          Get support <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}

function getPageContext(pathname: string, role: UserRole) {
  const match = findPortalNavigationItem(pathname, role);
  if (pathname.endsWith("/new"))
    return { title: "Add teacher", section: "Teachers" };
  if (pathname === "/portal/profile")
    return { title: "Account settings", section: "Portal" };
  return { title: match?.label ?? "Portal", section: roleStyles[role].label };
}

function Topbar({
  user,
  mobileOpen,
  onMenuClick,
}: {
  user: AuthenticatedUser;
  mobileOpen: boolean;
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = roleStyles[user.role];
  const context = useMemo(
    () => getPageContext(pathname, user.role),
    [pathname, user.role],
  );
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const initials =
    [user.firstName?.[0], user.lastName?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || user.email.slice(0, 2).toUpperCase();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    function close(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-19 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="grid size-11 place-items-center rounded-2xl text-slate-900 hover:bg-slate-50 lg:hidden"
        aria-label={
          mobileOpen ? "Close portal navigation" : "Open portal navigation"
        }
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <div className="hidden min-w-0 lg:block">
        <p className="truncate font-display text-lg font-extrabold leading-tight text-slate-950">
          {context.title}
        </p>
        <p className="text-sm text-slate-500">{context.section}</p>
      </div>

      <div className="ml-auto hidden w-full max-w-sm px-6 xl:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search portal"
            placeholder="Search the portal..."
            className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative grid size-10 place-items-center rounded-full text-slate-500 hover:bg-slate-50"
          aria-label="View notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-2xl p-1.5 pr-2 hover:bg-slate-50"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-xl font-display text-sm font-extrabold text-white",
                meta.solid,
              )}
            >
              {initials}
            </span>
            <span className="hidden max-w-36 text-left sm:block">
              <span className="block truncate text-sm font-extrabold text-slate-900">
                {name}
              </span>
              <span className={cn("block text-xs font-bold", meta.text)}>
                {meta.label}
              </span>
            </span>
            <ChevronDown
              className={cn(
                "hidden size-4 text-slate-400 transition sm:block",
                menuOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_18px_55px_-20px_rgba(15,23,42,.4)]"
              >
                <button
                  type="button"
                  onClick={() => router.push("/portal/profile")}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="size-4" />
                  Account settings
                </button>
                <button
                  type="button"
                  onClick={() =>
                    logout.mutate(undefined, {
                      onSuccess: () => {
                        router.replace("/sign-in");
                        router.refresh();
                      },
                    })
                  }
                  disabled={logout.isPending}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                >
                  <LogOut className="size-4" />
                  {logout.isPending ? "Signing out..." : "Sign out"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export function PortalShell({
  user,
  children,
}: {
  user: AuthenticatedUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-svh w-full bg-slate-50 text-slate-950">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <SidebarContent user={user} />
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              aria-label="Close portal navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", stiffness: 330, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarContent
                user={user}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <Topbar
          user={user}
          mobileOpen={mobileOpen}
          onMenuClick={() => setMobileOpen((open) => !open)}
        />
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
