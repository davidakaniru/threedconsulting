import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { submitLessonRequestSchema, submitUnifiedLessonRequest } from "@/modules/lesson-requests";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const input = await submitLessonRequestSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true });
    const result = await submitUnifiedLessonRequest(input, request.nextUrl.origin);
    return apiSuccess(result, 201);
  } catch (error) {
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the highlighted details.", 422);
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Unified enrolment failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "We could not submit your enrolment.", 500);
  }
}
