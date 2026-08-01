"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { EventCard } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import { events } from "@/data/events";

export function EventsSection() {
  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
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
            Upcoming events
          </span>

          <h2
            className="font-display text-3xl font-extrabold
              leading-tight text-foreground md:text-[2.75rem]"
          >
            Workshops, camps &amp; celebrations
          </h2>

          <p
            className="mt-4 text-lg leading-relaxed
              text-muted-foreground"
          >
            Come along, try something new and experience the joy of learning
            together.
          </p>
        </motion.div>

        <div
          className="grid gap-6
            sm:grid-cols-2 lg:grid-cols-3"
        >
          {events.slice(0, 3).map((event, index) => (
            <motion.div
              key={event.title}
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
                delay: (index % 3) * 0.05,
              }}
              className="h-full"
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <Link href="/events">View all events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
