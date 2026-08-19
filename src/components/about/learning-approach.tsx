import Link from "next/link";
import { ArrowRight, Check, MessageCircleHeart } from "lucide-react";

import { Button } from "@/components/ui/button";

const principles = [
  "Personalised curriculum from Primary to high school",
  "Learning tailored to each student's ability and pace",
  "Support for learners aged 4-18, anywhere in the world",
  "A focus on building genuine, lasting confidence",
  "Essential skills developed for lifelong learning",
];

export function LearningApproach() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
      <div
        className="mx-auto grid max-w-7xl items-center gap-12
          lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <span
            className="font-display text-sm font-bold uppercase
              tracking-wider text-turquoise"
          >
            Our approach to learning
          </span>

          <h2
            className="mt-3 font-display text-3xl font-extrabold
              leading-tight text-foreground md:text-4xl"
          >
            A personalised approach to every learner
          </h2>

          <p
            className="mt-5 text-lg leading-8
              text-muted-foreground"
          >
            Our personalised approach helps students strengthen their
            academic performance, build confidence and develop essential
            skills for lifelong learning.
          </p>

          <ul className="mt-7 space-y-4">
            {principles.map((principle) => (
              <li key={principle} className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid size-7 shrink-0
                    place-items-center rounded-full
                    bg-turquoise/15 text-teal-700"
                >
                  <Check
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={3}
                  />
                </span>

                <span
                  className="font-semibold leading-7
                    text-foreground"
                >
                  {principle}
                </span>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-8">
            <Link href="/tutoring">
              Explore our tutoring
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div
          className="relative overflow-hidden rounded-[3rem]
            bg-turquoise/15 p-8 sm:p-12"
        >
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 size-56
              rounded-full bg-primary/20"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-16 size-64
              rounded-full bg-pink/30"
          />

          <div
            className="relative rounded-[2.25rem] bg-white
              p-7 shadow-xl sm:p-10"
          >
            <MessageCircleHeart
              aria-hidden="true"
              className="size-14 text-coral"
              strokeWidth={1.7}
            />

            <blockquote
              className="mt-6 font-display text-2xl
                font-extrabold leading-relaxed text-foreground
                sm:text-3xl"
            >
              "Everyone has the potential to grow, learn and achieve more
              with the right support."
            </blockquote>

            <p
              className="mt-5 font-display font-bold
                text-primary"
            >
              Our guiding belief
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
