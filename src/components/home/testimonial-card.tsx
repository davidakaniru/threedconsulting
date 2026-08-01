import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export type TestimonialTone = "sky" | "teal" | "coral" | "grape";

export type Testimonial = {
  name: string;
  review: string;
  rating: number;
  childAge: string;
  tone: TestimonialTone;
  initials: string;
};

const toneStyles: Record<TestimonialTone, string> = {
  sky: "bg-[#38bdf8]",
  teal: "bg-[#2dd4bf]",
  coral: "bg-[#ff7a59]",
  grape: "bg-[#a78bfa]",
};

type TestimonialCardProps = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article
      className="flex h-full flex-col rounded-3xl border
        border-sky-50/80 bg-white p-6
        shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]"
    >
      <div
        className="flex items-center gap-1"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const isActive = index < testimonial.rating;

          return (
            <Star
              key={index}
              aria-hidden="true"
              className={cn(
                "size-5",
                isActive
                  ? "fill-[#fccf3f] text-[#fccf3f]"
                  : "fill-sky-100 text-sky-100",
              )}
            />
          );
        })}
      </div>

      <blockquote
        className="mt-4 flex-1 text-base leading-relaxed
          text-foreground"
      >
        “{testimonial.review}”
      </blockquote>

      <footer className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full",
            "font-display font-extrabold text-white",
            toneStyles[testimonial.tone],
          )}
        >
          {testimonial.initials}
        </span>

        <div>
          <cite
            className="block font-display font-bold not-italic
              leading-tight text-foreground"
          >
            {testimonial.name}
          </cite>

          <p className="text-sm text-muted-foreground">
            {testimonial.childAge}
          </p>
        </div>
      </footer>
    </article>
  );
}
