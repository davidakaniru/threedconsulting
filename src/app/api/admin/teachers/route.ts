import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { createTeacherSchema } from "@/modules/teachers/schemas";
import { getTeachers, inviteTeacher } from "@/modules/teachers/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const q = request.nextUrl.searchParams;
    return apiSuccess(await getTeachers({ page: Number(q.get("page") || 1), pageSize: Number(q.get("pageSize") || 10), search: q.get("search") ?? undefined, status: q.get("status") ?? undefined }));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Admin teachers GET failed", error); return apiError("INTERNAL_SERVER_ERROR", "Unable to load teachers.", 500);
  }
}

export async function POST() {
  return apiError(
    "MANUAL_TUTOR_CREATION_DISABLED",
    "Tutors must be created by accepting a tutor application.",
    410,
  );
}
