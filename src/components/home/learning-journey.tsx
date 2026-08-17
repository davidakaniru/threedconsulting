"use client";

import {
  Circle,
  ClipboardCheck,
  Compass,
  HeartHandshake,
  LineChart,
  PartyPopper,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type JourneyTone = "sky" | "grass" | "coral" | "sun" | "grape" | "teal";

type JourneyStep = {
  step: string;
  description: string;
  icon: LucideIcon;
  tone: JourneyTone;
};

const journey: JourneyStep[] = [
  {
    step: "Discover",
    description:
      "Explore subjects and book a friendly, no-pressure open day.",
    icon: Compass,
    tone: "sky",
  },
  {
    step: "Register",
    description: "Complete our simple, secure online enrolment in minutes.",
    icon: ClipboardCheck,
    tone: "grass",
  },
  {
    step: "Meet Your Tutor",
    description:
      "A warm welcome call to match your child with the right tutor.",
    icon: HeartHandshake,
    tone: "coral",
  },
  {
    step: "Start Learning",
    description: "Small classes, big smiles — learning begins with confidence.",
    icon: Rocket,
    tone: "sun",
  },
  {
    step: "Track Progress",
    description: "Follow milestones and reports from your parent dashboard.",
    icon: LineChart,
    tone: "grape",
  },
  {
    step: "Celebrate Success",
    description: "Certificates, showcases and joyful graduation moments.",
    icon: PartyPopper,
    tone: "teal",
  },
];

const toneStyles: Record<JourneyTone, string> = {
  sky: "bg-[#38bdf8]",
  grass: "bg-[#4ade80]",
  coral: "bg-[#ff7a59]",
  sun: "bg-[#fccf3f]",
  grape: "bg-[#a78bfa]",
  teal: "bg-[#2dd4bf]",
};

export function LearningJourney() {
  return (
    <section
      className="relative overflow-hidden bg-[#f5f3ff]/50
        px-5 py-16 sm:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-9 hidden h-1
              rounded-full bg-[#ddd6fe] lg:block"
          />

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {journey.map((item, index) => (
              <JourneyItem key={item.step} item={item} index={index} />
            ))}
          </ol>
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
        The learning journey
      </span>

      <h2
        className="font-display text-3xl font-extrabold leading-tight
          text-foreground md:text-[2.75rem]"
      >
        Six joyful steps to success
      </h2>

      <p
        className="mt-4 text-lg leading-relaxed
          text-muted-foreground"
      >
        From first hello to graduation day — a clear, supportive path you and
        your child take together.
      </p>
    </motion.div>
  );
}

type JourneyItemProps = {
  item: JourneyStep;
  index: number;
};

function JourneyItem({ item, index }: JourneyItemProps) {
  const Icon = item.icon ?? Circle;

  return (
    <motion.li
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
      className="relative text-center"
    >
      <span
        className={cn(
          "relative z-10 mx-auto grid size-18 place-items-center",
          "rounded-full text-white",
          "shadow-[0_18px_45px_-20px_rgba(56,116,189,0.35)]",
          toneStyles[item.tone],
        )}
      >
        <Icon aria-hidden="true" className="size-8" />

        <span
          className="absolute -right-1 -top-2 grid size-7
            place-items-center rounded-full bg-white font-display
            text-sm font-extrabold text-foreground
            shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]"
        >
          {index + 1}
        </span>
      </span>

      <h3 className="mt-4 font-display font-bold text-foreground">
        {item.step}
      </h3>

      <p
        className="mt-1.5 text-sm leading-relaxed
          text-muted-foreground"
      >
        {item.description}
      </p>
    </motion.li>
  );
}
