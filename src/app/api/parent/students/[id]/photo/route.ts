import type { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiParent } from "@/lib/auth/guards";
import { uploadParentStudentPhoto } from "@/modules/students/server";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const parent = await requireApiParent();
    const { id } = await context.params;
    const form = await request.formData();
    const photo = form.get("photo");

    if (!(photo instanceof File))
      return apiError("PHOTO_REQUIRED", "Choose a child profile photo.", 422);

    return apiSuccess(await uploadParentStudentPhoto(parent.id, id, photo));
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to upload child photo.", 500);
  }
}
