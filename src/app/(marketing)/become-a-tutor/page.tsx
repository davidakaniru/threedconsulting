
import type { Metadata } from "next";

import { BecomeATutorForm } from "@/modules/tutor-applications/components/become-a-tutor-form";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Become a Tutor",
  description:
    "Apply to become a tutor with Three-dmanagers and join our community of dedicated educators.",
};

export default function BecomeATutorPage() {
  return (
    <>
      <PageHero
        eyebrow="Join our tutor community"
        title={
          <>
            Become a{" "}
            <span className="text-[#ff7a59]">tutor</span> with Three-dmanagers
          </>
        }
        subtitle="If you are passionate about teaching and have expertise in a particular subject, we would love to hear from you."
      />

      <section className="bg-[#fff8ee] px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-4xl">
          <BecomeATutorForm />
        </div>
      </section>
    </>
  );
}
