import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { uploadStudentPhoto } from "@/modules/students/server";
export const runtime="nodejs";type Context={params:Promise<{id:string}>};
export async function POST(request:NextRequest,c:Context){try{await requireApiAdmin();const form=await request.formData();const photo=form.get("photo");if(!(photo instanceof File))return apiError("PHOTO_REQUIRED","Choose a student photo.",422);return apiSuccess(await uploadStudentPhoto((await c.params).id,photo));}catch(error){if(error instanceof ApiError)return apiError(error.code,error.message,error.status,error.details);console.error("Student photo upload failed",error);return apiError("INTERNAL_SERVER_ERROR","Unable to upload the student photo.",500);}}
