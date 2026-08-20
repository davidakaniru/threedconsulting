import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiTeacher } from "@/lib/auth/guards";
import { getTeacher, updateOwnTeacherProfile } from "@/modules/teachers/server";
import { teacherProfileSchema } from "@/modules/teachers/schemas";
export const runtime = "nodejs";
export async function GET() { try { const teacher = await requireApiTeacher(); return apiSuccess(await getTeacher(teacher.id)); } catch (error) { if (error instanceof ApiError) return apiError(error.code,error.message,error.status,error.details); return apiError("INTERNAL_SERVER_ERROR","Unable to load your teacher profile.",500); } }
export async function PATCH(request: NextRequest) { try { const teacher = await requireApiTeacher(); const input = await teacherProfileSchema.validate(await request.json(),{abortEarly:false,stripUnknown:true}); return apiSuccess(await updateOwnTeacherProfile(teacher.id,input)); } catch (error) { if (error instanceof SyntaxError) return apiError("INVALID_JSON","The request body is invalid.",400); if (error instanceof ValidationError) return apiError("VALIDATION_ERROR","Please correct the highlighted fields.",422); if (error instanceof ApiError) return apiError(error.code,error.message,error.status,error.details); return apiError("INTERNAL_SERVER_ERROR","Unable to update your teacher profile.",500); } }
