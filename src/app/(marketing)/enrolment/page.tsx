import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { EnrolmentForm } from "@/components/forms/enrolment-form";

export const metadata: Metadata = {
  title: "Enrolment",
  description:
    "Start your child’s learning journey by completing our simple enrolment form.",
};

export default function EnrolmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Enrolment"
        title={
          <>
            Start your child’s <span className="text-turquoise">journey</span>
          </>
        }
        subtitle="A simple, secure enrolment that takes just a few minutes."
      />

      <section className="bg-cream px-5 pb-20 sm:px-8 md:pb-28">
        <EnrolmentForm />
      </section>
    </>
  );
}
