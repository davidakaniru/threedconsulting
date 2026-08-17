import type { Metadata } from "next";

import { ContactFaqPrompt } from "@/components/contact/contact-faq-prompt";
import { ContactSection } from "@/components/contact/contact-section";
import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact our friendly team with questions about subjects, trial lessons, events or enrolment.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            We’d <span className="text-coral">love</span> to hear <br /> from you
          </>
        }
        subtitle="Questions about subjects, enrolment or the platform? Our friendly team is here to help."
      />

      <ContactSection />

      <ContactFaqPrompt />
    </>
  );
}
