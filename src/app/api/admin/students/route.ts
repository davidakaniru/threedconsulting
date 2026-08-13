import type { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { getStudents } from "@/modules/students/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const query = request.nextUrl.searchParams;
    return apiSuccess(
      await getStudents({
        page: Number(query.get("page") || 1),
        pageSize: Number(query.get("pageSize") || 10),
        search: query.get("search") ?? undefined,
        status: query.get("status") ?? undefined,
      }),
    );
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    console.error("Students GET failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load students.", 500);
  }
}

export async function POST() {
  try {
    await requireApiAdmin();
    return apiError(
      "STUDENT_CREATION_DISABLED",
      "Students are created through the enrolment and lesson-matching workflow.",
      403,
    );
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to process request.", 500);
  }
}
