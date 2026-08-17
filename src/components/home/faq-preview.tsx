"use client";

import { motion } from "motion/react";

import { FAQAccordion, type FAQItem } from "@/components/ui/faq-accordion";

const faqs: FAQItem[] = [
  {
    question: "What subjects and exams do Three-dmanagers tutors cover?",
    answer:
      "Our tutors cover a wide range of subjects including but not limited to Mathematics, Science,English and more. Additionally,we provide preparation for exams such as National 4, National 5, Highers,Advanced Highers, GCSEs and A-Levels.",
  },
  {
    question: "Are Three-dmanagers tutors qualified?",
    answer:
      "Yes, all Three-dmanagers tutors undergo a rigorous selection process to ensure they possess the necessary qualifications,expertise and dedication to provide high quality tutoring services",
  },
  {
    question: "Can I chose tutors?",
    answer:
      "While parents cannot select tutors, our matching system is designed to pair students with the most suitable tutors based on their specific requirements and preferences.",
  },
  {
    question: "How can I become a tutor with Three-dmanager?",
    answer:
      "If you are passionate about teaching and have expertise in a particular subject,we will love to hear from you.Simply visit our website to apply as a tutor",
  },
  {
    question: "Can I register outside United Kingdom?",
    answer:
      "Yes,location is never a barrier as all our classes are online.Students join classes from any part of the world",
  },
  {
    question: "What is the structure of the classes?",
    answer:
      "Our online one-on-one classes provide a unique opportunity for personalised instruction,allowing students to engage directly with experienced educators.",
  },
];

export function FAQPreview() {
  return (
    <section
      id="faqs"
      className="bg-sky-50/60 px-5 py-16
        sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs} />
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
        Questions &amp; answers
      </span>

      <h2
        className="font-display text-3xl font-extrabold
          leading-tight text-foreground md:text-[2.75rem]"
      >
        Everything parents want to know
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        Can’t find your answer? Our friendly team is always happy to help.
      </p>
    </motion.div>
  );
}
