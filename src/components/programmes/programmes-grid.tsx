"use client";

import { motion } from "motion/react";

import { ProgrammeCard } from "@/components/home/programme-card";
import { programmes } from "@/data/programmes";

export function ProgrammesGrid() {
  return (
    <section
      className="-mt-8 bg-[#fff8ee] px-5 pb-16
        sm:px-8 md:pb-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.map((programme, index) => (
            <motion.div
              key={programme.slug}
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
              <ProgrammeCard programme={programme} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
