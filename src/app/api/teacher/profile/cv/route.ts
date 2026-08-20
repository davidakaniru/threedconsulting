import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiTeacher } from "@/lib/auth/guards";
import { uploadOwnTeacherCv } from "@/modules/teachers/server";
export const runtime = "nodejs";
const MAX_CV_BYTES = 10 * 1024 * 1024;
export async function POST(request: NextRequest) {
  try {
    const teacher = await requireApiTeacher();
    const cv = (await request.formData()).get("cv");
    if (!(cv instanceof File))
      return apiError("CV_REQUIRED", "Please choose a CV to upload.", 422);
    if (cv.type !== "application/pdf")
      return apiError(
        "CV_TYPE_INVALID",
        "Please upload your CV as a PDF.",
        422,
      );
    if (cv.size === 0 || cv.size > MAX_CV_BYTES)
      return apiError(
        "CV_SIZE_INVALID",
        "Your CV must be 10 MB or smaller.",
        422,
      );
    return apiSuccess(await uploadOwnTeacherCv(teacher.id, cv));
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to upload your CV.", 500);
  }
}
