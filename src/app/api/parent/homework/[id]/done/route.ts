import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiRole } from "@/lib/auth/guards";
import { markParentHomeworkDone } from "@/modules/parent-dashboard/server";

type Context = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Context) {
  try {
    const parent = await requireApiRole("parent");
    const { id } = await params;
    return apiSuccess(await markParentHomeworkDone(parent.id, id));
  } catch (error) {
    if (error instanceof ApiError)
      return apiError(error.code, error.message, error.status, error.details);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to mark homework as done.";
    const status = message.includes("cannot update")
      ? 403
      : message.includes("not found")
        ? 404
        : 400;
    return apiError("HOMEWORK_COMPLETE_FAILED", message, status);
  }
}
