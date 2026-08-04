import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiRole } from "@/lib/auth/guards";
import { attendanceUpdateSchema } from "@/modules/attendance/schemas";
import { getSessionAttendance, saveSessionAttendance } from "@/modules/attendance/server";
type Context = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, { params }: Context) { try { const teacher = await requireApiRole("teacher"); return apiSuccess(await getSessionAttendance((await params).id, teacher.id)); } catch (e) { if (e instanceof ApiError) return apiError(e.code, e.message, e.status, e.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to load attendance.", 500); } }
export async function PATCH(request: NextRequest, { params }: Context) { try { const teacher = await requireApiRole("teacher"); const input = await attendanceUpdateSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true }); return apiSuccess(await saveSessionAttendance((await params).id, teacher.id, input)); } catch (e) { if (e instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the attendance sheet.", 422); if (e instanceof ApiError) return apiError(e.code, e.message, e.status, e.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to save attendance.", 500); } }
