"use client";

import { motion } from "motion/react";
import { TeacherCard, type PublicTutor } from "@/components/shared/public-tutor-card";

export function TeachersGrid({ tutors }: { tutors: PublicTutor[] }) {
  return (
    <section className="-mt-8 bg-[#fff8ee] px-5 pb-16 sm:px-8 md:pb-24">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor, index) => (
            <motion.div key={tutor.id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: (index % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }} className="h-full">
              <TeacherCard teacher={tutor} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
