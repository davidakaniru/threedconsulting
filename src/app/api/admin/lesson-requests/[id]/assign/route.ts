import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { assignLessonRequest } from "@/modules/lesson-requests/server";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireApiAdmin();
    const body = await request.json();
    if (!body?.teacherId) return apiError("INVALID_REQUEST", "Tutor is required.", 400);
    return apiSuccess(await assignLessonRequest((await params).id, body.teacherId, admin.id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error(error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to assign the tutor.", 500);
  }
}
