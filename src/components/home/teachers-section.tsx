"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicTutor } from "@/modules/teachers/types";

const tones = ["bg-sky-500", "bg-teal-500", "bg-violet-500"];
export function TeachersSection({ tutors }: { tutors: PublicTutor[] }) {
  return (
    <section className="bg-[#fff8ee] px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />
        {tutors.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.slice(0, 3).map((tutor, index) => (
              <motion.div
                key={tutor.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TutorCard tutor={tutor} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Our tutor profiles will appear here soon.
          </p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="outline" size="lg" asChild>
            <Link href="/teachers">Meet our tutors</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/become-a-tutor">
              Become a tutor
              <span aria-hidden="true">→</span>
            </Link>
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
        Meet our tutors
      </span>
      <h2 className="font-display text-3xl font-extrabold leading-tight text-foreground md:text-[2.75rem] max-w-lg mx-auto">
        Friendly faces your child will adore
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-md mx-auto">
        Qualified specialists who make every lesson feel personal, supportive
        and engaging.
      </p>
    </motion.div>
  );
}
function TutorCard({ tutor, index }: { tutor: PublicTutor; index: number }) {
  const initials = tutor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <article className="group h-full rounded-3xl border border-sky-50 bg-white p-6 text-center shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.4)]">
      <div
        className={`mx-auto grid size-20 place-items-center rounded-full font-display text-2xl font-extrabold text-white shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 ${tones[index % tones.length]}`}
      >
        {initials}
      </div>
      <h2 className="mt-4 font-display text-lg font-extrabold text-foreground">
        {tutor.name}
      </h2>
      <p className="text-sm font-bold text-sky-600">
        {tutor.specialization || "Qualified tutor"}
      </p>
      {tutor.qualification && (
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Award aria-hidden="true" className="size-4" />
          {tutor.qualification}
        </p>
      )}
    </article>
  );
}
