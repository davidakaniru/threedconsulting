import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, Star, ThumbsUp, Users } from "lucide-react";

import {
  AdminPage,
  EmptyState,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { AdminReviewFilters } from "@/modules/lesson-reviews/components/admin-review-filters";
import {
  getLessonReviewFilterOptions,
  listAdminLessonReviews,
} from "@/modules/lesson-reviews/server";

export const metadata: Metadata = { title: "Lesson Reviews | Admin Portal" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    teacherId?: string;
    programmeId?: string;
    rating?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const rating = Number(params.rating);
  const [reviews, options] = await Promise.all([
    listAdminLessonReviews({
      teacherId: params.teacherId || undefined,
      programmeId: params.programmeId || undefined,
      rating: Number.isInteger(rating) && rating >= 1 && rating <= 5
        ? rating
        : undefined,
      from: params.from || undefined,
      to: params.to || undefined,
    }),
    getLessonReviewFilterOptions(),
  ]);

  const average = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const recommendCount = reviews.filter((review) => review.wouldRecommend).length;

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Quality"
        title="Lesson reviews"
        description="Review parent feedback about lesson outcomes and teaching experience. Reviews are internal and are not visible to teachers or the public."
      />

      <MetricGrid>
        <MetricCard label="Reviews" value={reviews.length} icon={MessageSquareText} />
        <MetricCard label="Average rating" value={average} icon={Star} />
        <MetricCard label="Would recommend" value={recommendCount} icon={ThumbsUp} />
        <MetricCard
          label="Teachers reviewed"
          value={new Set(reviews.map((review) => review.teacherId)).size}
          icon={Users}
        />
      </MetricGrid>

      <SectionCard
        title="Filters"
        description="Search reviews by teacher or programme, then narrow by rating or submission date."
      >
        <AdminReviewFilters
          teachers={options.teachers}
          programmes={options.programmes}
          initial={{
            teacherId: params.teacherId,
            programmeId: params.programmeId,
            rating: params.rating,
            from: params.from,
            to: params.to,
          }}
        />
      </SectionCard>

      <SectionCard title="Parent feedback" description="Newest reviews appear first.">
        {!reviews.length ? (
          <EmptyState
            icon={MessageSquareText}
            title="No reviews found"
            description="Parent feedback matching these filters will appear here."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/portal/admin/reviews/${review.id}`}
                className="block py-4 transition hover:bg-slate-50 sm:px-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold">{review.childName}</p>
                      <span className="text-sm text-muted-foreground">·</span>
                      <p className="text-sm font-semibold text-primary">
                        {review.programmeName}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Teacher: {review.teacherName} · Parent: {review.parentName}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                      {review.lessonOutcome}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex justify-start gap-0.5 text-amber-500 sm:justify-end">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className="size-4"
                          fill={value <= review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {new Intl.DateTimeFormat("en-NG", {
                        dateStyle: "medium",
                      }).format(new Date(review.createdAt))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </AdminPage>
  );
}
