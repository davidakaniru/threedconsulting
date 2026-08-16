import { createAdminClient } from "@/lib/supabase/admin";

const SHEET_SELECT =
  "id,status,notes,marked_at,student_id,students!inner(id,admission_number,first_name,middle_name,last_name)" as const;

export function getAttendanceRows(sessionId: string) {
  return createAdminClient()
    .from("session_attendance")
    .select(SHEET_SELECT)
    .eq("session_id", sessionId);
}

