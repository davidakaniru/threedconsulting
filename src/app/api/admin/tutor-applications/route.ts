import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { getTutorApplications } from "@/modules/tutor-applications/server/admin-tutor-application.service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await requireApiAdmin();
    const q = request.nextUrl.searchParams;
    const statusParam = q.get("status");
    const allowedStatuses = new Set([
      "pending",
      "reviewing",
      "accepted",
      "rejected",
      "all",
    ]);
    const status =
      statusParam && allowedStatuses.has(statusParam)
        ? (statusParam as
            | "pending"
            | "reviewing"
            | "accepted"
            | "rejected"
            | "all")
        : undefined;

    return apiSuccess(
      await getTutorApplications({
        page: Number(q.get("page") || 1),
        pageSize: Number(q.get("pageSize") || 10),
        search: q.get("search") ?? undefined,
        status,
      }),
    );
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);
    console.error("Admin tutor applications GET failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "Unable to load tutor applications.",
      500,
    );
  }
}
