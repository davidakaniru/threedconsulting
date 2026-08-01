"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, CirclePlay, ShieldCheck, Star } from "lucide-react";

import {
  BookIllustration,
  LightbulbIllustration,
  PuzzleIllustration,
  RainbowIllustration,
  RocketIllustration,
  StarIllustration,
} from "@/components/home/hero-illustrations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const floatingIllustrations = [
  {
    Illustration: RocketIllustration,
    className: "top-4 -left-4 h-16 w-16 animate-floaty",
  },
  {
    Illustration: StarIllustration,
    className: "top-10 right-6 h-12 w-12 animate-floaty-slow",
  },
  {
    Illustration: BookIllustration,
    className: "bottom-24 -left-6 h-14 w-14 animate-floaty-slow",
  },
  {
    Illustration: RainbowIllustration,
    className: "bottom-4 right-2 h-16 w-16 animate-floaty",
  },
] as const;

const familyDots = [
  "bg-[#38bdf8]",
  "bg-[#ff7a59]",
  "bg-[#4ade80]",
  "bg-[#fccf3f]",
] as const;

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,#f0f9ff,#fff8ee,#f5eadb)]
        px-5 pb-20 pt-10 sm:px-8 md:pb-28 md:pt-16"
    >
      <BackgroundBlob className="-left-24 -top-10 size-96" color="#e0f2fe" />

      <BackgroundBlob className="-right-24 top-20 size-80" color="#fef3c7" />

      <BackgroundBlob className="-bottom-32 left-1/3 size-72" color="#dcfce7" />

      <div
        aria-hidden="true"
        className="absolute left-[6%] top-[18%] hidden animate-floaty-slow
          opacity-90 xl:block"
      >
        <LightbulbIllustration title={undefined} className="size-16" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[16%] right-[8%] hidden animate-floaty
          opacity-90 xl:block"
      >
        <PuzzleIllustration title={undefined} className="size-16" />
      </div>

      <div
        className="relative mx-auto grid max-w-7xl items-center gap-12
          lg:grid-cols-2"
      >
        {/* Hero copy */}
        <div>
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white
              px-4 py-2 shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
          >
            <span className="flex -space-x-1.5" aria-hidden="true">
              {familyDots.map((colour) => (
                <span
                  key={colour}
                  className={cn(
                    "size-6 rounded-full border-2 border-white",
                    colour,
                  )}
                />
              ))}
            </span>

            <span className="font-display text-sm font-bold text-foreground">
              Loved by 4,800+ families
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.05,
            }}
            className="mt-6 font-display text-4xl font-extrabold
              leading-[1.03] text-foreground sm:text-5xl
              md:text-6xl xl:text-7xl"
          >
            Where children{" "}
            <span className="relative inline-block text-primary">
              love
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8c30-6 86-6 116 0"
                  stroke="#fccf3f"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>{" "}
            to learn
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
            }}
            className="mt-5 max-w-xl text-lg leading-relaxed
              text-muted-foreground md:text-xl"
          >
            Bright, safe and inspiring learning programmes that make children
            excited to learn — and give parents complete confidence in every
            step of the journey.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.18,
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/enrolment">
                Start enrolment
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/15 bg-white
                text-foreground shadow-sm hover:border-primary/35
                hover:bg-white hover:text-foreground"
              asChild
            >
              <Link href="/programmes">
                <CirclePlay data-icon="inline-start" className="text-primary" />
                Explore programmes
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.28,
            }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2
              text-sm font-semibold text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck
                aria-hidden="true"
                className="size-5 text-[#22c55e]"
              />
              DBS-checked teachers
            </span>

            <span className="flex items-center gap-1.5">
              <Star
                aria-hidden="true"
                className="size-5 fill-[#fccf3f] text-[#fccf3f]"
              />
              Rated 4.9 / 5 by parents
            </span>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          <div
            className="relative aspect-4/3 rotate-1 overflow-hidden
              rounded-[2.5rem] border-8 border-white
              shadow-[0_24px_55px_rgba(15,23,42,0.18)]"
          >
            <Image
              src="/imgs/img1.jpg"
              alt="A smiling teacher with a small group of happy, diverse children learning together in a bright classroom"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {floatingIllustrations.map(({ Illustration, className }, index) => (
            <div
              key={index}
              aria-hidden="true"
              className={cn("absolute", className)}
            >
              <Illustration
                title={undefined}
                className="size-full drop-shadow-md"
              />
            </div>
          ))}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="absolute -bottom-5 left-4 flex items-center gap-3
              rounded-2xl bg-white px-4 py-3
              shadow-[0_12px_30px_rgba(15,23,42,0.14)] sm:left-8"
          >
            <span
              className="grid size-10 place-items-center rounded-full
                bg-[#dcfce7]"
            >
              <Star
                aria-hidden="true"
                className="size-5 fill-[#22c55e] text-[#16a34a]"
              />
            </span>

            <div>
              <p
                className="font-display font-extrabold leading-none
                  text-foreground"
              >
                98%
              </p>

              <p className="text-xs text-muted-foreground">
                parent satisfaction
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

type BackgroundBlobProps = {
  className?: string;
  color: string;
};

function BackgroundBlob({ className, color }: BackgroundBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute animate-blob rounded-[42%_58%_60%_40%/45%_45%_55%_55%]",
        "opacity-60 blur-2xl",
        className,
      )}
      style={{
        backgroundColor: color,
      }}
    />
  );
}
