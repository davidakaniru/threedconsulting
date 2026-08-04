import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { approveEnrolmentSchema } from "@/modules/enrolments/schemas";
import { approveEnrolment } from "@/modules/enrolments/server";
export const runtime = "nodejs";
export async function POST(
  r: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireApiAdmin();
    const v = await approveEnrolmentSchema.validate(await r.json(), {
      abortEarly: false,
      stripUnknown: true,
    });
    return apiSuccess(await approveEnrolment((await params).id, v, admin.id));
  } catch (e) {
    if (e instanceof ValidationError)
      return apiError(
        "VALIDATION_ERROR",
        "Select a cohort for every programme.",
        422,
      );
    if (e instanceof ApiError)
      return apiError(e.code, e.message, e.status, e.details);
    console.error(e);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "Unable to approve enrolment.",
      500,
    );
  }
}
