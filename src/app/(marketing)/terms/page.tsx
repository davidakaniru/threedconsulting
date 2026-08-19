import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Three-dmanagers’ services.",
};

const terms = [
  {
    title: "Services",
    body: "Threedconsulting provides online tutoring and business consulting services. Services are delivered according to the agreed programme, schedule and scope.",
  },
  {
    title: "Bookings & Payments",
    body: "Sessions must be booked in advance. Fees are payable according to the agreed payment terms. Cancellations or missed sessions may be subject to our cancellation policy.",
  },
  {
    title: "Tutoring",
    body: "Parents/guardians are responsible for ensuring students are available and have suitable internet access and a learning environment for online sessions.",
  },
  {
    title: "Business Consulting",
    body: "Consulting outcomes depend on the information, cooperation and decisions provided by the client. Three-dmanagers will provide professional guidance but does not guarantee specific business results.",
  },
  {
    title: "Intellectual Property",
    body: "Materials, resources and content provided by Three-dmanagers remain our intellectual property unless otherwise agreed in writing.",
  },
  {
    title: "Conduct",
    body: "We expect respectful and professional behaviour from students, parents, tutors and clients. We reserve the right to suspend services where conduct is inappropriate or abusive.",
  },
  {
    title: "Changes",
    body: "Three-dmanagers reserve the right to update these terms when necessary. Updated terms will be communicated through appropriate channels.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Terms & <span className="text-purple">Conditions</span>
          </>
        }
        subtitle="By using Three-dmanagers’ services, you agree to the following terms."
      />

      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="space-y-8">
          {terms.map((term, index) => (
            <section key={term.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">
                {index + 1}. {term.title}
              </h2>
              <p className="mt-3 leading-7 text-slate-600">{term.body}</p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
