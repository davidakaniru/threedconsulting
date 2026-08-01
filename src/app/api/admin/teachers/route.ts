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

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const input = await createTeacherSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true });
    return apiSuccess(await inviteTeacher(input, request.nextUrl.origin), 201);
  } catch (error) {
    if (error instanceof SyntaxError) return apiError("INVALID_JSON", "The request body is invalid.", 400);
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string,string>>((a, i) => { if (i.path && !a[i.path]) a[i.path] = i.message; return a; }, {});
      return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422, details);
    }
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Teacher provisioning failed", error); return apiError("INTERNAL_SERVER_ERROR", "Unable to add the teacher.", 500);
  }
}
