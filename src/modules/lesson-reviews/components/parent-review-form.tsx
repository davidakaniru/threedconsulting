"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toApiError } from "@/lib/api/errors";
import {
  lessonReviewSchema,
  type LessonReviewRequest,
} from "@/modules/lesson-reviews/schemas";
import type { ParentReviewContext } from "@/modules/lesson-reviews/types";

export function ParentReviewForm({
  context,
}: {
  context: ParentReviewContext;
}) {
  const router = useRouter();
  const review = context.review;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LessonReviewRequest>({
    resolver: yupResolver(lessonReviewSchema),
    defaultValues: {
      rating: review?.rating ?? 0,
      lessonOutcome: review?.lessonOutcome ?? "",
      teacherFeedback: review?.teacherFeedback ?? "",
      wouldRecommend: review?.wouldRecommend ?? undefined,
      additionalComments: review?.additionalComments ?? "",
    },
  });

  async function submit(input: LessonReviewRequest) {
    try {
      const response = await fetch(
        `/api/parent/lesson-assignments/${context.assignmentId}/review`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
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
    <form onSubmit={handleSubmit(submit)} className="space-y-7" noValidate>
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <div>
            <p className="font-display text-sm font-bold text-foreground">
              Overall rating <span className="text-coral">*</span>
            </p>
            <div
              className="mt-3 flex gap-2"
              role="radiogroup"
              aria-label="Rating"
              aria-invalid={Boolean(errors.rating)}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.onChange(value)}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={field.value === value}
                  className={`grid size-11 place-items-center rounded-xl border transition ${
                    value <= field.value
                      ? "border-amber-300 bg-amber-50 text-amber-500"
                      : "border-slate-200 bg-white text-slate-300 hover:border-amber-200"
                  }`}
                >
                  <Star
                    className="size-5"
                    fill={value <= field.value ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            {errors.rating?.message && (
              <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>
        )}
      />

      <Textarea
        id="lesson-outcome"
        label="Lesson outcome / child's progress"
        required
        rows={5}
        {...register("lessonOutcome")}
        errorMessage={errors.lessonOutcome?.message}
        placeholder="What changes, progress or outcomes have you noticed?"
      />

      <Textarea
        id="teacher-feedback"
        label="Feedback about the tutor"
        required
        rows={5}
        {...register("teacherFeedback")}
        errorMessage={errors.teacherFeedback?.message}
        placeholder="Share your experience with the tutor's effectiveness, communication, punctuality or approach."
      />

      <Controller
        name="wouldRecommend"
        control={control}
        render={({ field }) => (
          <div>
            <p className="font-display text-sm font-bold text-foreground">
              Would you recommend this tutor? <span className="text-coral">*</span>
            </p>
            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Would recommend">
              <Button
                type="button"
                variant={field.value === true ? "default" : "outline"}
                aria-pressed={field.value === true}
                onClick={() => field.onChange(true)}
              >
                Yes
              </Button>
              <Button
                type="button"
                variant={field.value === false ? "default" : "outline"}
                aria-pressed={field.value === false}
                onClick={() => field.onChange(false)}
              >
                No
              </Button>
            </div>
            {errors.wouldRecommend?.message && (
              <p role="alert" className="mt-2 text-xs font-medium text-destructive">
                {errors.wouldRecommend.message}
              </p>
            )}
          </div>
        )}
      />

      <Textarea
        id="additional-comments"
        label="Additional comments"
        rows={4}
        {...register("additionalComments")}
        errorMessage={errors.additionalComments?.message}
        placeholder="Anything else you would like us to know? (optional)"
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : review
              ? "Update feedback"
              : "Submit feedback"}
        </Button>
      </div>
    </form>
  );
}
