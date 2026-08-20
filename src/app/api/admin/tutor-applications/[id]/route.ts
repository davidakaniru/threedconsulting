import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import * as yup from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { getTutorApplication, performTutorApplicationAction } from "@/modules/tutor-applications/server/admin-tutor-application.service";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const actionSchema = yup.object({
  type: yup.mixed<"accept" | "reject">().oneOf(["accept", "reject"]).required(),
  reason: yup.string().trim().max(1000).optional(),
});

export async function GET(_request: NextRequest, context: Context) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    return apiSuccess(await getTutorApplication(id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Admin tutor application GET failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load the tutor application.", 500);
  }
}

