import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiParent } from "@/lib/auth/guards";
import { updateStudentPersonalSchema } from "@/modules/students/schemas";
import {
  getParentStudent,
  updateStudentPersonal,
} from "@/modules/students/server";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
  try {
    const parent = await requireApiParent();
    const { id } = await context.params;
    return apiSuccess(await getParentStudent(parent.id, id));
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load child profile.", 500);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const parent = await requireApiParent();
    const { id } = await context.params;
    const input = await updateStudentPersonalSchema.validate(
      await request.json(),
      { abortEarly: false, stripUnknown: true },
    );
    return apiSuccess(await updateStudentPersonal(parent.id, id, input));
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>(
        (result, item) => {
          if (item.path && !result[item.path]) result[item.path] = item.message;
          return result;
        },
        {},
      );
      return apiError(
        "VALIDATION_ERROR",
        "Please correct the highlighted fields.",
        422,
        details,
      );
    }
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to update child profile.", 500);
  }
}
