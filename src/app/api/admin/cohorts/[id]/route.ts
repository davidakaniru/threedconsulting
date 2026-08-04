import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { cohortSchema } from "@/modules/cohorts/schemas";
import { getCohort, updateCohort } from "@/modules/cohorts/server";
export const runtime = "nodejs";
type C = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, { params }: C) {
  try {
    await requireApiAdmin();
    return apiSuccess(await getCohort((await params).id));
  } catch (e) {
    if (e instanceof ApiError)
      return apiError(e.code, e.message, e.status, e.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load the cohort.", 500);
  }
}
export async function PATCH(r: NextRequest, { params }: C) {
  try {
    const admin = await requireApiAdmin();
    const input = await cohortSchema.validate(await r.json(), {
      abortEarly: false,
      stripUnknown: true,
    });
    return apiSuccess(await updateCohort((await params).id, input, admin.id));
  } catch (e) {
    if (e instanceof ValidationError)
      return apiError(
        "VALIDATION_ERROR",
        "Please correct the highlighted fields.",
        422,
      );
    if (e instanceof ApiError)
      return apiError(e.code, e.message, e.status, e.details);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "Unable to update the cohort.",
      500,
    );
  }
}
