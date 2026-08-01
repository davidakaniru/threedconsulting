"use client";

import { motion } from "motion/react";

import { FAQAccordion, type FAQItem } from "@/components/ui/faq-accordion";

const faqs: FAQItem[] = [
  {
    question: "What ages do you teach?",
    answer:
      "We welcome children from age 4 to 16, with programmes carefully designed for each stage — from playful early reading through to focused GCSE preparation.",
  },
  {
    question: "How do you keep my child safe?",
    answer:
      "Every teacher is DBS-checked and safeguarding-trained. Our centres have secure sign-in and sign-out, small supervised classes, and a dedicated safeguarding lead. Online sessions use a secure, monitored platform.",
  },
  {
    question: "How big are the classes?",
    answer:
      "We cap every class at six children so each learner gets genuine attention and support at their own pace.",
  },
  {
    question: "Can I track my child’s progress?",
    answer:
      "Yes. Registered families get a personalised parent dashboard with progress tracking, attendance, homework, certificates and direct messaging with teachers.",
  },
  {
    question: "Do you offer online and in-person classes?",
    answer:
      "Both. Choose in-person at our centres, live online classes, or a flexible blend — whatever suits your family.",
  },
  {
    question: "What if my child needs extra support?",
    answer:
      "Every child gets a personalised learning plan. Our teachers adapt pace and content, and we’re always happy to talk through individual needs.",
  },
  {
    question: "How do payments work?",
    answer:
      "Simple, transparent monthly or termly plans managed securely from your dashboard. No hidden fees, and you can pause or change programmes easily.",
  },
  {
    question: "How do I get started?",
    answer:
      "Book a free open day or start enrolment online. We’ll follow up with a friendly welcome call to match your child with the perfect teacher.",
  },
];

export function FAQPreview() {
  return (
    <section
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
