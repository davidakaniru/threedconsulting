import { apiError, apiSuccess } from "@/lib/api/responses";
import { AppAuthError } from "@/lib/auth/auth-errors";
import { logout } from "@/lib/auth/auth.service";

export const runtime = "nodejs";

export async function POST() {
  try {
    await logout();
    return apiSuccess({ message: "Signed out successfully." });
  } catch (error) {
    if (error instanceof AppAuthError) return apiError(error.code, error.message, error.status);
    console.error("Logout failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to sign out. Please try again.", 500);
  }
}
