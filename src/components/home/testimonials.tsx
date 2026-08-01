"use client";

import { motion } from "motion/react";

import {
  TestimonialCard,
  type Testimonial,
} from "@/components/home/testimonial-card";

const testimonials: Testimonial[] = [
  {
    name: "Rebecca T.",
    review:
      "My daughter went from dreading maths to asking for extra worksheets. The teachers are wonderful and I love the progress reports.",
    rating: 5,
    childAge: "Parent of Maya, age 8",
    tone: "sky",
    initials: "RT",
  },
  {
    name: "James M.",
    review:
      "The coding club sparked something in my son. He’s building his own games now. Safe, professional and genuinely fun.",
    rating: 5,
    childAge: "Parent of Ethan, age 10",
    tone: "teal",
    initials: "JM",
  },
  {
    name: "Aisha K.",
    review:
      "Small classes make all the difference. My twins feel seen and supported, and communication with staff is brilliant.",
    rating: 5,
    childAge: "Parent of Zara & Yusuf, age 7",
    tone: "coral",
    initials: "AK",
  },
  {
    name: "Helen P.",
    review:
      "From the first open day I felt this was a place I could trust. The graduation celebration brought tears to my eyes.",
    rating: 5,
    childAge: "Parent of Oliver, age 11",
    tone: "grape",
    initials: "HP",
  },
];

export function Testimonials() {
  return (
    <section className="bg-sky-50/60 px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
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
                delay: (index % 2) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
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
        className="mb-3 inline-block font-display text-sm
          font-bold uppercase tracking-wider text-primary"
      >
        Parent testimonials
      </span>

      <h2
        className="font-display text-3xl font-extrabold
          leading-tight text-foreground md:text-[2.75rem]"
      >
        Words from families like yours
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        Trust is earned. Here’s what parents say about learning with ThreeD
        Consulting.
      </p>
    </motion.div>
  );
}
