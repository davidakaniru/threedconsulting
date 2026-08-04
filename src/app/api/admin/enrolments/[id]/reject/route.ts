import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { rejectEnrolmentSchema } from "@/modules/enrolments/schemas";
import { rejectEnrolment } from "@/modules/enrolments/server";
export const runtime = "nodejs";
export async function POST(
  r: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireApiAdmin();
    const v = await rejectEnrolmentSchema.validate(await r.json(), {
      abortEarly: false,
      stripUnknown: true,
    });
    return apiSuccess(
      await rejectEnrolment((await params).id, v.reviewNotes, admin.id),
    );
  } catch (e) {
    if (e instanceof ValidationError)
      return apiError(
        "VALIDATION_ERROR",
        "Please provide a rejection reason.",
        422,
      );
    if (e instanceof ApiError)
      return apiError(e.code, e.message, e.status, e.details);
    console.error(e);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "Unable to reject enrolment.",
      500,
    );
  }
}
