import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MonthlyTeacherReport, TeacherMonthlyActivity } from "../types";
const one = (v: any) => (Array.isArray(v) ? v[0] : v);
export function normalizeReportMonth(value?: string) {
  const now = new Date();
  const fallback = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return fallback;
  return value;
}
function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return {
    from: `${month}-01`,
    to: `${month}-${String(last).padStart(2, "0")}`,
    label: new Intl.DateTimeFormat("en-NG", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, 1))),
  };
}
export type TeacherReportOption = {
  value: string;
  label: string;
};

export async function getTeacherReportOptions(): Promise<TeacherReportOption[]> {
  const db = createAdminClient() as any;
  const { data, error } = await db
    .from("teachers")
    .select(
      "id,employee_id,profiles!inner(first_name,last_name,email)",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("Tutors could not be loaded for reporting.");

  return (data ?? [])
    .map((row: any) => {
      const profile = one(row.profiles);
      const name =
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        profile?.email ||
        "Tutor";

      return {
        value: row.id as string,
        label: `${name} · ${row.employee_id}`,
      };
    })
    .sort((a: TeacherReportOption, b: TeacherReportOption) =>
      a.label.localeCompare(b.label),
    );
}

export async function getMonthlyTeacherActivityReport(
  rawMonth?: string,
  teacherId?: string,
): Promise<MonthlyTeacherReport> {
  const month = normalizeReportMonth(rawMonth);
  const range = monthRange(month);
  const db = createAdminClient() as any;
  let query = db
    .from("class_sessions")
    .select(
      "id,title,session_date,start_time,status,lesson_assignments!inner(teacher_id,student_id,students(first_name,middle_name,last_name),programmes(name),teachers(profiles(first_name,last_name,email)))",
    )
    .not("lesson_assignment_id", "is", null)
    .gte("session_date", range.from)
    .lte("session_date", range.to);

  if (teacherId) {
    query = query.eq("lesson_assignments.teacher_id", teacherId);
  }

  const { data, error } = await query
    .order("session_date", { ascending: false })
    .order("start_time", { ascending: false });
  if (error) throw new Error("Tutor activity report could not be loaded.");
  const map = new Map<string, TeacherMonthlyActivity>();
  const allStudents = new Set<string>();
  for (const row of data ?? []) {
    const la = one(row.lesson_assignments);
    if (!la) continue;
    const teacher = one(la.teachers);
    const profile = one(teacher?.profiles);
    const student = one(la.students);
    const programme = one(la.programmes);
    const teacherId = la.teacher_id;
    allStudents.add(la.student_id);
    let item = map.get(teacherId);
    if (!item) {
      item = {
        teacherId,
        teacherName:
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
          profile?.email ||
          "Tutor",
        email: profile?.email || "",
        studentsTaught: 0,
        sessionsTotal: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        draft: 0,
        programmes: [],
        sessions: [],
      };
      map.set(teacherId, item);
    }
    item.sessionsTotal++;
    if (row.status in item) (item as any)[row.status]++;
    const pn = programme?.name || "Subject";
    const pc = item.programmes.find((x) => x.name === pn);
    if (pc) pc.sessions++;
    else item.programmes.push({ name: pn, sessions: 1 });
    item.sessions.push({
      id: row.id,
      title: row.title,
      date: row.session_date,
      startTime: row.start_time,
      status: row.status,
      studentName:
        [student?.first_name, student?.middle_name, student?.last_name]
          .filter(Boolean)
          .join(" ") || "Child",
      programmeName: pn,
    });
  }
  for (const item of map.values()) {
    item.studentsTaught = new Set(item.sessions.map((s) => s.studentName)).size;
    item.programmes.sort((a, b) => b.sessions - a.sessions);
  }
  const teachers = [...map.values()].sort(
    (a, b) =>
      b.sessionsTotal - a.sessionsTotal ||
      a.teacherName.localeCompare(b.teacherName),
  );
  return {
    month,
    label: range.label,
    totals: {
      teachers: teachers.length,
      students: allStudents.size,
      sessions: teachers.reduce((n, t) => n + t.sessionsTotal, 0),
      completed: teachers.reduce((n, t) => n + t.completed, 0),
      cancelled: teachers.reduce((n, t) => n + t.cancelled, 0),
    },
    teachers,
  };
}
