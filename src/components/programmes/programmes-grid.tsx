"use client";

import { motion } from "motion/react";

import type { PublicSubject } from "@/components/home/subject-card";

export function ProgrammesGrid({ subjects }: { subjects: PublicSubject[] }) {
  return (
    <section
      className="-mt-8 bg-[#fff8ee] px-5 pb-16
        sm:px-8 md:pb-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{
                opacity: 0,
                y: 28,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-60px",
              }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <div className="h-full">
                <a
                  href={`/programmes/${subject.slug}`}
                  className="block h-full"
                >
                  <article className="flex h-full flex-col rounded-3xl border border-sky-50 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <h2 className="font-display text-xl font-extrabold text-foreground">
                      {subject.name}
                    </h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                      {subject.description ||
                        `Explore our ${subject.name} tutoring.`}
                    </p>
                    <span className="mt-4 font-display font-bold text-sky-600">
                      Learn more →
                    </span>
                  </article>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
