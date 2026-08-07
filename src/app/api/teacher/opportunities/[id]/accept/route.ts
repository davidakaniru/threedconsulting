import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiRole } from "@/lib/auth/guards";
import { claimTeacherOpportunity } from "@/modules/lesson-requests/server";

export const runtime = "nodejs";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const teacher = await requireApiRole("teacher");
    return apiSuccess(await claimTeacherOpportunity((await params).id, teacher.id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error(error); return apiError("INTERNAL_SERVER_ERROR", "Unable to accept this enrolment.", 500);
  }
}
