"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheckBig, Lock } from "lucide-react";
import { DashboardMock } from "@/components/shared/dashboard-mockup";
import { adminDash, parentDash, teacherDash } from "@/data/platform";
import { cn } from "@/lib/utils";

const tabs = [
  {
    key: "parent",
    label: "Parent Portal",
    data: parentDash,
    blurb: "Everything about your child in one calm, beautiful place.",
  },
  {
    key: "teacher",
    label: "Teacher Portal",
    data: teacherDash,
    blurb: "Plan, teach and track — with less admin and more impact.",
  },
  {
    key: "admin",
    label: "Admin Platform",
    data: adminDash,
    blurb: "Run the whole organisation from one connected dashboard.",
  },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function PlatformPreview() {
  const [active, setActive] = useState<TabKey>("parent");

  const current = tabs.find((tab) => tab.key === active) ?? tabs[0];

  return (
    <section
      className="relative overflow-hidden bg-[#f5f3ff]/40
        px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div
          role="tablist"
          aria-label="Platform previews"
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {tabs.map((tab) => {
            const isActive = active === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`platform-tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`platform-panel-${tab.key}`}
                onClick={() => setActive(tab.key)}
                className={cn(
                  "relative rounded-full px-5 py-2.5",
                  "font-display text-sm font-bold",
                  "transition-colors focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-[#a78bfa]",
                  "focus-visible:ring-offset-2",
                  isActive
                    ? "text-white"
                    : "bg-white text-muted-foreground shadow-sm hover:text-foreground",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="platform-tab"
                    className="absolute inset-0 rounded-full bg-[#8b5cf6]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                ) : null}

                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div
          className="grid items-center gap-8
            lg:grid-cols-[1fr_1.4fr]"
        >
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full
                bg-white px-3 py-1.5 text-sm font-bold
                text-[#7c3aed] shadow-sm"
            >
              <Lock aria-hidden="true" className="size-4" />
              Secure &amp; private
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`platform-panel-${active}`}
                role="tabpanel"
                aria-labelledby={`platform-tab-${active}`}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                <h3
                  className="mt-4 font-display text-2xl font-extrabold
                    text-foreground md:text-3xl"
                >
                  {current.label}
                </h3>

                <p
                  className="mt-3 max-w-lg leading-relaxed
                    text-muted-foreground"
                >
                  {current.blurb}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {current.data.nav.slice(1, 6).map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-2
                        text-foreground"
                    >
                      <CircleCheckBig
                        aria-hidden="true"
                        className="size-4 shrink-0
                          text-[#8b5cf6]"
                      />

                      <span className="font-semibold">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <DashboardMock {...current.data} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      transition={{
        duration: 0.5,
      }}
      className="mx-auto mb-12 max-w-3xl text-center"
    >
      <span
        className="mb-3 inline-block font-display text-sm
          font-bold uppercase tracking-wider text-primary"
      >
        One connected platform
      </span>

      <h2
        className="font-display text-3xl font-extrabold
          leading-tight text-foreground md:text-[2.75rem]"
      >
        A secure digital home for every family
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        Registered families gain access to a personalised dashboard — part of
        one connected ecosystem for parents, teachers and administrators.
      </p>
    </motion.div>
  );
}
