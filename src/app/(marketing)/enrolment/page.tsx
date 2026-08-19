import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { EnrolmentForm } from "@/components/forms/enrolment-form";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listParentEnrolmentChildren } from "@/modules/lesson-requests/server";

export const metadata: Metadata = {
  title: "Enrol Your Child",
  description:
    "Create your parent account and request the lesson schedule that works for your child.",
};

type Props = {
  searchParams: Promise<{ child?: string }>;
};

export default async function EnrolmentPage({ searchParams }: Props) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  const parent = user?.role === "parent" ? user : null;
  const existingChildren = parent
    ? await listParentEnrolmentChildren(parent.id)
    : [];
  const initialExistingStudentId = existingChildren.some(
    (child) => child.id === params.child,
  )
    ? params.child
    : null;

  return (
    <>
      <PageHero
        eyebrow="Enrolment"
        title={
          <>
            Enrol your child for <br />
            <span className="text-turquoise">one-to-one lessons</span>
          </>
        }
        subtitle="Tell us the subject, preferred days and time. We’ll review your request and match your child with an eligible teacher."
      />
      <section className="bg-cream px-5 pb-20 sm:px-8 md:pb-28">
        <EnrolmentForm
          hasParentAccount={Boolean(parent)}
          parentName={parent?.firstName}
          parentEmail={parent?.email}
          existingChildren={existingChildren}
          initialExistingStudentId={initialExistingStudentId}
        />
      </section>
    </>
  );
}
