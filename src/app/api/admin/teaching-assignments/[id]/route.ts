import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { updateTeachingAssignmentSchema } from "@/modules/teaching-assignments/schemas";
import { removeTeachingAssignment, updateTeachingAssignment } from "@/modules/teaching-assignments/server";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: NextRequest, context: Context) { try { const admin = await requireApiAdmin(); const values = await updateTeachingAssignmentSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true }); return apiSuccess(await updateTeachingAssignment((await context.params).id, values, admin.id)); } catch (error) { if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to update the teaching assignment.", 500); } }
export async function DELETE(_: NextRequest, context: Context) { try { const admin = await requireApiAdmin(); return apiSuccess(await removeTeachingAssignment((await context.params).id, admin.id)); } catch (error) { if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details); return apiError("INTERNAL_SERVER_ERROR", "Unable to remove the teaching assignment.", 500); } }
