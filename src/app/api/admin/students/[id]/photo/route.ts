import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiError } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";

export const runtime = "nodejs";

export async function POST(_: NextRequest) {
  try {
    await requireApiAdmin();
    return apiError(
      "STUDENT_PHOTO_PARENT_MANAGED",
      "Student profile photos are managed by the linked parent.",
      403,
    );
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to process request.", 500);
  }
}
