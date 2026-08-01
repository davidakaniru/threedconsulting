import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ContactFaqPrompt() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
      <div
        className="mx-auto flex max-w-5xl flex-col
          items-center justify-between gap-7
          rounded-[2.5rem] bg-sky-100 p-7
          text-center sm:p-10
          md:flex-row md:text-left"
      >
        <div
          className="flex flex-col items-center gap-5
            md:flex-row"
        >
          <span
            className="grid size-16 shrink-0 place-items-center
              rounded-2xl bg-primary text-white"
          >
            <CircleHelp aria-hidden="true" className="size-8" />
          </span>

          <div>
            <h2
              className="font-display text-2xl font-extrabold
                text-foreground"
            >
              You may find the answer already waiting
            </h2>

            <p
              className="mt-2 max-w-xl leading-7
                text-muted-foreground"
            >
              Browse our frequently asked questions for quick information about
              classes, payments, trials and enrolment.
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="shrink-0 bg-white"
        >
          <Link href="/faqs">
            View FAQs
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
