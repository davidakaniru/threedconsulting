"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  SubjectCard,
  type PublicSubject,
} from "@/components/home/subject-card";

export function ProgrammesSection({ subjects }: { subjects: PublicSubject[] }) {
  return (
    <section
      id="programmes"
      className="bg-linear-to-b from-sky-50/60 to-[#fff8ee] px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.slice(0, 3).map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <SubjectCard subject={subject} />
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/programmes">See all subjects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <span className="mb-3 inline-block font-display text-sm font-bold uppercase tracking-wider text-primary">
        Our subjects
      </span>
      <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-[2.75rem]">
        Learning Built Around You
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto">
        Explore the subjects currently offered by Three-dmanagers, each taught
        by specialists in supportive one-to-one classes.
      </p>
    </motion.div>
  );
}
