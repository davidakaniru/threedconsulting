"use client";

import {
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Home,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    title: "Qualified Teachers",
    description:
      "Every tutor is DBS-checked, degree-qualified and specially trained for young learners.",
    icon: GraduationCap,
    iconBackground: "bg-[#e0f2fe]",
    iconColour: "text-[#0284c7]",
  },
  {
    title: "Safe Learning Environment",
    description:
      "Robust safeguarding, secure sign-ins and a warm, welcoming space.",
    icon: ShieldCheck,
    iconBackground: "bg-[#dcfce7]",
    iconColour: "text-[#16a34a]",
  },
  {
    title: "Small Class Sizes",
    description:
      "Never more than six children per class, so nobody gets left behind.",
    icon: Users,
    iconBackground: "bg-[#ffe4d9]",
    iconColour: "text-[#f85e38]",
  },
  {
    title: "Fun Learning Experience",
    description: "Games, projects and stories make progress feel like play.",
    icon: Sparkles,
    iconBackground: "bg-[#fef3c7]",
    iconColour: "text-[#d99806]",
  },
  {
    title: "Progress Tracking",
    description:
      "Clear reports and milestones you can follow from your dashboard.",
    icon: TrendingUp,
    iconBackground: "bg-[#ede9fe]",
    iconColour: "text-[#7c3aed]",
  },
  {
    title: "Personalised Support",
    description: "Learning plans shaped around your child’s pace and goals.",
    icon: HeartHandshake,
    iconBackground: "bg-[#ccfbf1]",
    iconColour: "text-[#0d9488]",
  },
  {
    title: "Flexible Programmes",
    description: "Weekday, weekend and holiday options that fit family life.",
    icon: CalendarDays,
    iconBackground: "bg-[#ffe4ee]",
    iconColour: "text-[#db2777]",
  },
  {
    title: "Strong Community",
    description:
      "Events, clubs and a friendly parent community you can lean on.",
    icon: Home,
    iconBackground: "bg-[#e0f2fe]",
    iconColour: "text-[#0284c7]",
  },
] satisfies ReadonlyArray<{
  title: string;
  description: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColour: string;
}>;

export function WhyParents() {
  return (
    <section className="bg-[#fffdf8] px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
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
        className="mb-3 inline-block font-display text-sm font-bold
          uppercase tracking-wider text-primary"
      >
        Why parents choose us
      </span>

      <h2
        className="font-display text-3xl font-extrabold leading-tight
          text-foreground md:text-[2.75rem]"
      >
        A trusted partner in your child’s education
      </h2>

      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Everything we do is designed to earn your confidence — from qualified
        teachers to a genuinely joyful way of learning.
      </p>
    </motion.div>
  );
}

type Feature = (typeof features)[number];

type FeatureCardProps = {
  feature: Feature;
  index: number;
};

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <motion.article
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
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <div
        className="h-full rounded-[1.75rem] border border-[#f0f9ff]/80
          bg-white p-6 shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]
          transition-all duration-300
          ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:-translate-y-1.5
          hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.45)]"
      >
        <span
          className={`mb-4 grid size-14 place-items-center rounded-2xl
            ${feature.iconBackground}`}
        >
          <Icon aria-hidden="true" className={`size-7 ${feature.iconColour}`} />
        </span>

        <h3 className="font-display text-lg font-bold text-foreground">
          {feature.title}
        </h3>

        <p
          className="mt-2 text-[15px] leading-relaxed
            text-muted-foreground"
        >
          {feature.description}
        </p>
      </div>
    </motion.article>
  );
}
