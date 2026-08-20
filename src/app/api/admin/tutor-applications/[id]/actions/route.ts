import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import * as yup from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { performTutorApplicationAction } from "@/modules/tutor-applications/server/admin-tutor-application.service";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

const actionSchema = yup.object({
  type: yup.mixed<"accept" | "reject">().oneOf(["accept", "reject"]).required(),
  reason: yup.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest, context: Context) {
  try {
    const admin = await requireApiAdmin();
    const { id } = await context.params;
    const input = await actionSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    return apiSuccess(
      await performTutorApplicationAction(
        id,
        input,
        admin.id,
        request.nextUrl.origin,
      ),
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(
        "VALIDATION_ERROR",
        "The requested application action is invalid.",
        422,
      );
    }
    if (error instanceof ApiError) {
      return apiError(error.code, error.message, error.status, error.details);
    }
    console.error("Admin tutor application action failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "The application action could not be completed.",
      500,
    );
  }
}
