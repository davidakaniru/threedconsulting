import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { getSession } from "@/modules/sessions/server";
import type { AttendanceUpdateInput } from "../schemas";
import type { AttendanceRecord, AttendanceSummary, SessionAttendanceSheet } from "../types";
import * as repo from "./attendance.repository";

function summary(records: AttendanceRecord[]): AttendanceSummary {
  const counts = { pending: 0, present: 0, absent: 0, late: 0 };
  for (const record of records) counts[record.status] += 1;
  const marked = counts.present + counts.absent + counts.late;
  return {
    total: records.length,
    ...counts,
    attendanceRate: marked === 0 ? 0 : Math.round(((counts.present + counts.late) / marked) * 100),
  };
}

export async function getSessionAttendance(sessionId: string, teacherId: string): Promise<SessionAttendanceSheet> {
  const session = await getSession(sessionId);
  if (session.cohort.teacher.id !== teacherId) throw new ApiError("FORBIDDEN", "You cannot access this attendance sheet.", 403);
  const result = await repo.getAttendanceRows(sessionId);
  if (result.error) throw new ApiError("ATTENDANCE_LOAD_FAILED", "Attendance could not be loaded.", 500);
  const records: AttendanceRecord[] = (result.data ?? []).map((row: any) => {
    const student = Array.isArray(row.students) ? row.students[0] : row.students;
    return {
      id: row.id,
      studentId: row.student_id,
      admissionNumber: student.admission_number,
      studentName: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" "),
      status: row.status,
      notes: row.notes,
      markedAt: row.marked_at,
    };
  }).sort((a, b) => a.studentName.localeCompare(b.studentName));
  return {
    session: {
      id: session.id,
      title: session.title,
      status: session.status,
      sessionDate: session.sessionDate,
      startTime: session.startTime,
      endTime: session.endTime,
      cohort: { id: session.cohort.id, code: session.cohort.code, name: session.cohort.name, programmeName: session.cohort.programme.name },
    },
    records,
    summary: summary(records),
    editable: session.status === "scheduled" || session.status === "completed",
  };
}


export async function getAdminSessionAttendance(sessionId: string): Promise<SessionAttendanceSheet> {
  const session = await getSession(sessionId);
  const result = await repo.getAttendanceRows(sessionId);
  if (result.error) throw new ApiError("ATTENDANCE_LOAD_FAILED", "Attendance could not be loaded.", 500);
  const records: AttendanceRecord[] = (result.data ?? []).map((row: any) => {
    const student = Array.isArray(row.students) ? row.students[0] : row.students;
    return { id: row.id, studentId: row.student_id, admissionNumber: student.admission_number, studentName: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" "), status: row.status, notes: row.notes, markedAt: row.marked_at };
  }).sort((a, b) => a.studentName.localeCompare(b.studentName));
  return {
    session: { id: session.id, title: session.title, status: session.status, sessionDate: session.sessionDate, startTime: session.startTime, endTime: session.endTime, cohort: { id: session.cohort.id, code: session.cohort.code, name: session.cohort.name, programmeName: session.cohort.programme.name } },
    records, summary: summary(records), editable: false,
  };
}

export async function saveSessionAttendance(sessionId: string, teacherId: string, input: AttendanceUpdateInput) {
  const result = await repo.updateAttendanceSheet(sessionId, teacherId, input.records);
  if (result.error) throw new ApiError("ATTENDANCE_UPDATE_FAILED", result.error.message || "Attendance could not be saved.", 400);
  await writeAuditLog({
    actorId: teacherId,
    action: "attendance.updated",
    entityType: "class_session",
    entityId: sessionId,
    metadata: { recordsChanged: result.data ?? input.records.length },
  });
  return getSessionAttendance(sessionId, teacherId);
}
