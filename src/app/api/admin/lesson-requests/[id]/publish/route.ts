import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { publishLessonRequest } from "@/modules/lesson-requests/server";

export const runtime = "nodejs";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireApiAdmin();
    return apiSuccess(await publishLessonRequest((await params).id, admin.id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error(error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to publish the lesson request.", 500);
  }
}
