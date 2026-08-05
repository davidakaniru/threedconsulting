import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiRole } from "@/lib/auth/guards";
import { getParentAcademicDashboard } from "@/modules/parent-dashboard/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const parent = await requireApiRole("parent");
    return apiSuccess(await getParentAcademicDashboard(parent.id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error(error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load the academic dashboard.", 500);
  }
}
