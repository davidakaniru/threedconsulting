import { Award } from "lucide-react";

import type { Teacher } from "@/data/teachers";
import type { ProgrammeTone } from "@/data/programmes";
import { cn } from "@/lib/utils";

const toneStyles: Record<
  ProgrammeTone,
  {
    solid: string;
    soft: string;
    text: string;
  }
> = {
  sky: {
    solid: "bg-sky-500",
    soft: "bg-sky-100",
    text: "text-sky-600",
  },
  sun: {
    solid: "bg-amber-400",
    soft: "bg-amber-100",
    text: "text-amber-700",
  },
  grass: {
    solid: "bg-green-500",
    soft: "bg-green-100",
    text: "text-green-700",
  },
  coral: {
    solid: "bg-[#ff7a59]",
    soft: "bg-orange-100",
    text: "text-[#e75632]",
  },
  grape: {
    solid: "bg-violet-500",
    soft: "bg-violet-100",
    text: "text-violet-600",
  },
  teal: {
    solid: "bg-teal-500",
    soft: "bg-teal-100",
    text: "text-teal-700",
  },
  blush: {
    solid: "bg-pink-500",
    soft: "bg-pink-100",
    text: "text-pink-600",
  },
};

type TeacherCardProps = {
  teacher: Teacher;
};

export function TeacherCard({ teacher }: TeacherCardProps) {
  const tone = toneStyles[teacher.tone];

  return (
    <article
      className="group h-full rounded-3xl border border-sky-50
        bg-white p-6 text-center
        shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]
        transition-all duration-300
        ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:-translate-y-1.5
        hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.4)]"
    >
      <div
        className={cn(
          "mx-auto grid size-20 place-items-center rounded-full",
          "font-display text-2xl font-extrabold text-white",
          "shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)]",
          "transition-transform duration-300",
          "group-hover:rotate-3 group-hover:scale-105",
          tone.solid,
        )}
      >
        {teacher.initials}
      </div>

      <h2
        className="mt-4 font-display text-lg font-extrabold
          text-foreground"
      >
        {teacher.name}
      </h2>

      <p className={cn("text-sm font-bold", tone.text)}>{teacher.speciality}</p>

      <p
        className="mt-1 flex items-center justify-center gap-1.5
          text-sm text-muted-foreground"
      >
        <Award aria-hidden="true" className="size-4" />

        {teacher.experience}
      </p>

      <div className={cn("mt-4 rounded-2xl px-4 py-3 text-left", tone.soft)}>
        <p
          className="flex items-start gap-2 text-sm
            leading-relaxed text-foreground"
        >
          <span>
            <strong className="font-bold">Fun fact:</strong> {teacher.fact}
          </span>
        </p>
      </div>
    </article>
  );
}
