"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import {
  CloudIllustration,
  StarIllustration,
} from "@/components/home/hero-illustrations";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-b
        from-sky-50 via-[#fffdf8] to-[#fff8ee]
        px-5 pb-20 pt-14 sm:px-8 md:pb-28 md:pt-20"
    >
      <Blob className="-left-16 top-6 size-72" color="#e0f2fe" />

      <Blob className="-right-16 top-10 size-72" color="#fef3c7" />

      <div
        aria-hidden="true"
        className="absolute right-[12%] top-8 animate-floaty"
      >
        <StarIllustration className="size-14" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-10 left-[8%]
          animate-floaty-slow opacity-80"
      >
        <CloudIllustration className="size-16" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
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
          className="mb-4 inline-block rounded-full bg-white
            px-4 py-1.5 font-display text-sm font-bold
            text-sky-600
            shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]"
        >
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.05,
          }}
          className="font-display text-4xl font-extrabold
            leading-tight text-foreground
            md:text-[3.75rem]"
        >
          {title}
        </motion.h1>

        {subtitle ? (
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
            }}
            className="mt-5 text-lg leading-relaxed
              text-muted-foreground md:text-xl max-w-135 mx-auto"
          >
            {subtitle}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}

type BlobProps = {
  className?: string;
  color?: string;
};

function Blob({ className, color = "#bae6fd" }: BlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute rounded-[42%_58%_65%_35%/45%_45%_55%_55%]",
        "animate-blob blur-2xl opacity-60",
        className,
      )}
      style={{
        backgroundColor: color,
      }}
    />
  );
}
