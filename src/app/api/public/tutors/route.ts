import { apiError, apiSuccess } from "@/lib/api/responses";
import { getActiveTutorsForPublic } from "@/modules/teachers/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    return apiSuccess(await getActiveTutorsForPublic());
  } catch (error) {
    console.error("Public tutors GET failed", error);
    return apiError("TUTORS_LOAD_FAILED", "Tutors could not be loaded.", 500);
  }
}
