import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiParent } from "@/lib/auth/guards";
import { lessonReviewSchema } from "@/modules/lesson-reviews/schemas";
import {
  getParentReviewContext,
  saveParentLessonReview,
} from "@/modules/lesson-reviews/server";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
  try {
    const parent = await requireApiParent();
    const { id } = await context.params;
    return apiSuccess(await getParentReviewContext(parent.id, id));
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load feedback.", 500);
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const parent = await requireApiParent();
    const { id } = await context.params;
    const input = await lessonReviewSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });
    return apiSuccess(await saveParentLessonReview(parent.id, id, input));
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>(
        (result, item) => {
          if (item.path && !result[item.path]) result[item.path] = item.message;
          return result;
        },
        {},
      );
      return apiError(
        "VALIDATION_ERROR",
        "Please correct the highlighted feedback fields.",
        422,
        details,
      );
    }
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to save feedback.", 500);
  }
}
