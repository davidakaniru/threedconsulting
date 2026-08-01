import type { Metadata } from "next";

import { EventsGrid } from "@/components/events/events-grid";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "Explore workshops, holiday camps, competitions, clubs and family events for young learners.",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Upcoming events"
        title={
          <>
            Workshops, camps &amp;{" "}
            <span className="text-green-500">celebrations</span>
          </>
        }
        subtitle="Come and experience the joy for yourself — every event is a chance to learn, make friends and shine."
      />

      <EventsGrid />
    </>
  );
}
