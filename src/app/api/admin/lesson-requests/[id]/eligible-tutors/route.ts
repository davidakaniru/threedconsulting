import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { listEligibleTutors } from "@/modules/lesson-requests/server";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireApiAdmin();
    return apiSuccess(await listEligibleTutors((await params).id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error(error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load eligible tutors.", 500);
  }
}
