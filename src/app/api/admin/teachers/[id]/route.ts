import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { updateTeacherSchema } from "@/modules/teachers/schemas";
import { getTeacher, updateTeacher } from "@/modules/teachers/server";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    return apiSuccess(await getTeacher(id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Teacher detail GET failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load the teacher.", 500);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const values = await updateTeacherSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true });
    return apiSuccess(await updateTeacher(id, values));
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>((acc, item) => {
        if (item.path && !acc[item.path]) acc[item.path] = item.message;
        return acc;
      }, {});
      return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422, details);
    }
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Teacher detail PATCH failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to update the teacher.", 500);
  }
}
