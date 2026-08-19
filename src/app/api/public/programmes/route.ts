import { apiError, apiSuccess } from "@/lib/api/responses";
import { getPublishedProgrammesForPublic } from "@/modules/programmes/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    return apiSuccess(await getPublishedProgrammesForPublic());
  } catch (error) {
    console.error("Public programmes GET failed", error);
    return apiError("PROGRAMMES_LOAD_FAILED", "Programmes could not be loaded.", 500);
  }
}
