import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { createTeachingAssignmentSchema } from "@/modules/teaching-assignments/schemas";
import { createTeachingAssignment, getTeachingAssignments } from "@/modules/teaching-assignments/server";
export const runtime = "nodejs";
export async function GET(request: NextRequest) { try { await requireApiAdmin(); const q = request.nextUrl.searchParams; return apiSuccess(await getTeachingAssignments({ programmeId: q.get("programmeId") ?? undefined, teacherId: q.get("teacherId") ?? undefined, status: q.get("status") ?? undefined })); } catch (error) { if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to load teaching assignments.", 500); } }
export async function POST(request: NextRequest) { try { const admin = await requireApiAdmin(); const input = await createTeachingAssignmentSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true }); return apiSuccess(await createTeachingAssignment(input, admin.id), 201); } catch (error) { if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422); if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to create the teaching assignment.", 500); } }
