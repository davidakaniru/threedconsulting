"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/api/errors";
import type { ParentReviewContext } from "@/modules/lesson-reviews/types";

export function ParentReviewForm({
  context,
}: {
  context: ParentReviewContext;
}) {
  const router = useRouter();
  const review = context.review;
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [lessonOutcome, setLessonOutcome] = useState(
    review?.lessonOutcome ?? "",
  );
  const [teacherFeedback, setTeacherFeedback] = useState(
    review?.teacherFeedback ?? "",
  );
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(
    review?.wouldRecommend ?? null,
  );
  const [additionalComments, setAdditionalComments] = useState(
    review?.additionalComments ?? "",
  );
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!rating || wouldRecommend === null) {
      toast.error("Please complete the rating and recommendation.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch(
        `/api/parent/lesson-assignments/${context.assignmentId}/review`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            lessonOutcome,
            teacherFeedback,
            wouldRecommend,
            additionalComments,
          }),
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error?.message || "Your feedback could not be saved.",
        );
      }

      toast.success(review ? "Feedback updated." : "Feedback submitted.");
      router.push("/portal/parent/enrolments");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      setPending(false);
    }
  }

  if (!context.eligible && !review) {
    return (
      <div className="rounded-2xl bg-amber-50 p-5 text-sm text-amber-800">
        Feedback becomes available after the first completed session for this
        lesson.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-7">
      <div>
        <p className="font-display text-sm font-bold text-foreground">
          Overall rating <span className="text-coral">*</span>
        </p>
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className={`grid size-11 place-items-center rounded-xl border transition ${
                value <= rating
                  ? "border-amber-300 bg-amber-50 text-amber-500"
                  : "border-slate-200 bg-white text-slate-300 hover:border-amber-200"
              }`}
            >
              <Star
                className="size-5"
                fill={value <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <Textarea
        id="lesson-outcome"
        label="Lesson outcome / child's progress"
        required
        rows={5}
        value={lessonOutcome}
        onChange={(event) => setLessonOutcome(event.target.value)}
        placeholder="What changes, progress or outcomes have you noticed?"
      />

      <Textarea
        id="teacher-feedback"
        label="Feedback about the teacher"
        required
        rows={5}
        value={teacherFeedback}
        onChange={(event) => setTeacherFeedback(event.target.value)}
        placeholder="Share your experience with the teacher's effectiveness, communication, punctuality or approach."
      />

      <div>
        <p className="font-display text-sm font-bold text-foreground">
          Would you recommend this teacher?{" "}
          <span className="text-coral">*</span>
        </p>
        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            variant={wouldRecommend === true ? "default" : "outline"}
            onClick={() => setWouldRecommend(true)}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={wouldRecommend === false ? "default" : "outline"}
            onClick={() => setWouldRecommend(false)}
          >
            No
          </Button>
        </div>
      </div>

      <Textarea
        id="additional-comments"
        label="Additional comments"
        rows={4}
        value={additionalComments}
        onChange={(event) => setAdditionalComments(event.target.value)}
        placeholder="Anything else you would like us to know? (optional)"
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : review
              ? "Update feedback"
              : "Submit feedback"}
        </Button>
      </div>
    </form>
  );
}
