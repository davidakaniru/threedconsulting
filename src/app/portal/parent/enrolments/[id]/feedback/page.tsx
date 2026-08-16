import type { Metadata } from "next";

import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireParent } from "@/lib/auth/guards";
import { ParentReviewForm } from "@/modules/lesson-reviews/components/parent-review-form";
import { getParentReviewContext } from "@/modules/lesson-reviews/server";

export const metadata: Metadata = { title: "Lesson Feedback | Parent Portal" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const parent = await requireParent();
  const { id } = await params;
  const context = await getParentReviewContext(parent.id, id);

  return (
    <AdminPage className="max-w-4xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Lesson feedback"
        title={context.review ? "View / edit feedback" : "Give feedback"}
        description={`${context.childName} · ${context.programmeName} · ${context.teacherName}`}
      />
      <SectionCard
        title="Your experience"
        description={`${context.completedSessions} completed session${context.completedSessions === 1 ? "" : "s"} recorded for this lesson.`}
      >
        <ParentReviewForm context={context} />
      </SectionCard>
    </AdminPage>
  );
}
