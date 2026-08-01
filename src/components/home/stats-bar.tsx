"use client";

import { motion } from "motion/react";

import { Counter } from "@/components/ui/counter";

const stats = [
  {
    value: 4_800,
    suffix: "+",
    label: "Happy learners",
  },
  {
    value: 98,
    suffix: "%",
    label: "Parent satisfaction",
  },
  {
    value: 120,
    suffix: "+",
    label: "Qualified teachers",
  },
  {
    value: 11,
    suffix: "",
    label: "Subjects offered",
  },
] as const;

export function StatsBar() {
  return (
    <section
      aria-label="ThreeD Consulting statistics"
      className="relative z-10 -mt-6 px-5 sm:px-8"
    >
      <div
        className="mx-auto max-w-7xl rounded-3xl border border-sky-100
          bg-white px-6 py-8
          shadow-[0_12px_35px_rgba(15,23,42,0.08)]
          md:px-10"
      >
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
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
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <dt className="text-sm font-semibold text-muted-foreground">
                {stat.label}
              </dt>

              <dd
                className="order-first mb-1 font-display text-3xl
                  font-extrabold text-primary md:text-4xl"
              >
                <Counter to={stat.value} suffix={stat.suffix} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
