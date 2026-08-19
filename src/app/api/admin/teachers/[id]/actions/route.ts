import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { teacherActionSchema } from "@/modules/teachers/schemas";
import { performTeacherAction } from "@/modules/teachers/server";
import type { TeacherAction } from "@/modules/teachers/types";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const input = await teacherActionSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true });
    return apiSuccess(await performTeacherAction(id, input as TeacherAction, request.nextUrl.origin));
  } catch (error) {
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "The requested action is invalid.", 422);
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Teacher action failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "The teacher action could not be completed.", 500);
  }
}
