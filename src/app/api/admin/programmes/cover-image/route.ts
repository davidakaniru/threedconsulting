import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  try {
    await requireApiAdmin();
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return apiError("VALIDATION_ERROR", "Please select a cover image.", 422);
    }
    if (!ALLOWED.has(file.type)) {
      return apiError("VALIDATION_ERROR", "Cover image must be JPG, PNG or WebP.", 422);
    }
    if (file.size > MAX_SIZE) {
      return apiError("VALIDATION_ERROR", "Cover image must be 5 MB or smaller.", 422);
    }

    const path = `covers/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${EXTENSIONS[file.type]}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from("programme-covers")
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
        cacheControl: "31536000",
      });

    if (uploadError) {
      console.error("Programme cover upload failed", uploadError);
      return apiError("PROGRAMME_COVER_UPLOAD_FAILED", "The cover image could not be uploaded.", 500);
    }

    const { data } = supabase.storage.from("programme-covers").getPublicUrl(path);
    return apiSuccess({ url: data.publicUrl, path });
  } catch (error) {
    console.error("Programme cover upload route failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to upload the cover image.", 500);
  }
}
