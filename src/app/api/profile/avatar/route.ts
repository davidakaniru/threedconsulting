import type { NextRequest } from "next/server";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAuth } from "@/lib/auth/guards";
import { uploadAvatar } from "@/lib/profile/profile.service";

export const runtime = "nodejs";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const formData = await request.formData();
    const avatar = formData.get("avatar");

    if (!(avatar instanceof File)) {
      return apiError("AVATAR_REQUIRED", "Please choose an image to upload.", 422);
    }

    if (!ALLOWED_TYPES.has(avatar.type)) {
      return apiError("AVATAR_TYPE_INVALID", "Use a JPG, PNG, or WebP image.", 422);
    }

    if (avatar.size === 0 || avatar.size > MAX_AVATAR_BYTES) {
      return apiError("AVATAR_SIZE_INVALID", "Profile photos must be smaller than 2 MB.", 422);
    }

    return apiSuccess(await uploadAvatar(user.id, avatar));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Avatar upload failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to upload your profile photo.", 500);
  }
}
