"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { teachers } from "@/data/teachers";
import { TeacherCard } from "../shared/teacher-card";

export function TeachersSection() {
  return (
    <section className="bg-[#fff8ee] px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.slice(0, 3).map((teacher, index) => (
            <motion.div
              key={teacher.name}
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
                delay: (index % 3) * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <TeacherCard teacher={teacher} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/teachers">Meet the whole team</Link>
          </Button>
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
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span
        className="mb-3 inline-block font-display text-sm font-bold
          uppercase tracking-wider text-primary"
      >
        Meet our teachers
      </span>

      <h2
        className="font-display text-3xl font-extrabold leading-tight
          text-foreground md:text-[2.75rem]"
      >
        Friendly faces your child will adore
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        Qualified, DBS-checked specialists who make every lesson feel like an
        adventure.
      </p>
    </motion.div>
  );
}
