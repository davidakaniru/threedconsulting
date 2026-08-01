import { ContactForm } from "../forms/contact-form";
import { ContactDetails } from "./contact-details";

export function ContactSection() {
  return (
    <section
      className="-mt-8 bg-cream px-5 pb-16
        sm:px-8 md:pb-24"
    >
      <div
        className="relative mx-auto grid max-w-7xl
          items-start gap-8
          lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]"
      >
        <ContactForm />

        <ContactDetails />
      </div>
    </section>
  );
}
