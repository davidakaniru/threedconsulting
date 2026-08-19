import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AboutStory() {
  return (
    <section
      className="-mt-8 bg-cream px-5 pb-16
        sm:px-8 md:pb-24"
    >
      <div
        className="relative mx-auto grid max-w-7xl items-center
          gap-12 rounded-[2.5rem] bg-white px-6 py-10
          shadow-[0_25px_80px_-40px_rgba(56,116,189,0.35)]
          sm:px-10 md:py-16
          lg:grid-cols-[0.9fr_1.1fr] lg:px-16"
      >
        <StoryIllustration />

        <div>
          <span
            className="font-display text-sm font-bold uppercase
              tracking-wider text-coral"
          >
            Our story
          </span>

          <h2
            className="mt-3 font-display text-3xl font-extrabold
              leading-tight text-foreground md:text-4xl"
          >
            It started with one simple belief
          </h2>

          <div
            className="mt-6 space-y-5 text-lg leading-8
              text-muted-foreground"
          >
            <p>
              Every child deserves to experience the moment when something
              difficult finally makes sense—and to have someone beside them
              celebrating that achievement.
            </p>

            <p>
              We created our learning community to give young people a safe,
              encouraging place to ask questions, explore ideas and grow at
              their own pace.
            </p>

            <p>
              Today, our specialist teachers continue to combine excellent
              teaching with warmth, creativity and genuine care for every
              learner.
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/teachers">
              Meet our teachers
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StoryIllustration() {
  return (
    <div
      className="relative mx-auto grid aspect-square w-full
        max-w-107.5 place-items-center overflow-hidden
        rounded-[3rem] bg-sky-100"
    >
      <div
        aria-hidden="true"
        className="absolute -left-8 -top-10 size-40
          rounded-full bg-turquoise/35"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-12 -right-8 size-48
          rounded-full bg-purple/30"
      />

      <div
        className="relative grid size-48 place-items-center
          rounded-[3rem] bg-white shadow-xl
          sm:size-56"
      >
        <BookOpen
          aria-hidden="true"
          className="size-24 text-primary sm:size-28"
          strokeWidth={1.6}
        />

        <Heart
          aria-hidden="true"
          className="absolute -right-3 -top-4
            size-14 rotate-12 fill-coral text-coral"
        />
      </div>

      <Sparkles
        aria-hidden="true"
        className="absolute left-[12%] top-[18%]
          size-10 text-warning"
      />

      <Star
        aria-hidden="true"
        className="absolute bottom-[16%] right-[12%]
          size-11 rotate-12 fill-purple text-purple"
      />

      <span
        aria-hidden="true"
        className="absolute bottom-[22%] left-[13%]
          size-5 rounded-full bg-pink"
      />
    </div>
  );
}
