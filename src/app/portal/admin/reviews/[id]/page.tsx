import type { Metadata } from "next";
import { Star } from "lucide-react";

import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { getAdminLessonReview } from "@/modules/lesson-reviews/server";

export const metadata: Metadata = { title: "Review Details | Admin Portal" };

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getAdminLessonReview(id);

  return (
    <AdminPage className="max-w-5xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Lesson review"
        title={`${review.childName} · ${review.programmeName}`}
        description={`Feedback submitted by ${review.parentName}`}
      />

      <SectionCard title="Review summary">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Parent" value={`${review.parentName}${review.parentEmail ? ` · ${review.parentEmail}` : ""}`} />
          <Detail label="Tutor" value={`${review.teacherName}${review.teacherEmail ? ` · ${review.teacherEmail}` : ""}`} />
          <Detail label="Subject" value={review.programmeName} />
          <Detail label="Child" value={review.childName} />
          <Detail
            label="Would recommend"
            value={review.wouldRecommend ? "Yes" : "No"}
          />
          <Detail
            label="Submitted"
            value={new Intl.DateTimeFormat("en-NG", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(review.createdAt))}
          />
        </div>

        <div className="mt-6">
          <p className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
            Overall rating
          </p>
          <div className="mt-2 flex gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className="size-6"
                fill={value <= review.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Lesson outcome / child's progress">
        <p className="whitespace-pre-wrap leading-7 text-slate-700">
          {review.lessonOutcome}
        </p>
      </SectionCard>

      <SectionCard title="Feedback about the tutor">
        <p className="whitespace-pre-wrap leading-7 text-slate-700">
          {review.teacherFeedback}
        </p>
      </SectionCard>

      {review.additionalComments && (
        <SectionCard title="Additional comments">
          <p className="whitespace-pre-wrap leading-7 text-slate-700">
            {review.additionalComments}
          </p>
        </SectionCard>
      )}
    </AdminPage>
  );
}
