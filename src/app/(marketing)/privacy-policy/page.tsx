import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Three-dmanagers collects, uses and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Privacy <span className="text-purple">Policy</span>
          </>
        }
        subtitle="Three-dmanagers respect your privacy and is committed to protecting your personal information."
      />

      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8 lg:py-20">
        <div className="space-y-10 text-slate-600">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Information We Collect</h2>
            <p className="mt-3 leading-7">
              We may collect information such as names, contact details, student information,
              booking/payment information and information required to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">How We Use Your Information</h2>
            <p className="mt-3 leading-7">Your information may be used to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 leading-7">
              <li>Provide and manage our services.</li>
              <li>Communicate with parents, students and clients.</li>
              <li>Process payments and bookings.</li>
              <li>Improve our services and customer experience.</li>
              <li>Meet legal and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Data Protection</h2>
            <p className="mt-3 leading-7">
              We take reasonable measures to protect personal information against unauthorised
              access, loss or misuse. We do not sell personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Children’s Information</h2>
            <p className="mt-3 leading-7">
              Where our services involve children, information will be collected and managed with
              the involvement and consent of a parent or legal guardian where required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Your Rights</h2>
            <p className="mt-3 leading-7">
              You may have rights to access, correct, update or request deletion of your personal
              information, subject to applicable UK data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">Privacy Enquiries</h2>
            <p className="mt-3 leading-7">
              For privacy enquiries or requests, please contact Three-dmanagers through our
              official communication channels.
            </p>
            <p className="mt-4 leading-7">
              Three-dmanagers is committed to handling your information responsibly, transparently
              and securely.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
