import { createAdminClient } from "@/lib/supabase/admin";
import type { ParentAcademicDashboard, ParentDashboardChild } from "../types";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

export async function getParentAcademicDashboard(parentId: string): Promise<ParentAcademicDashboard> {
  const supabase = createAdminClient();
  const { data: links, error: linksError } = await supabase
    .from("student_parents")
    .select("student_id,students!inner(id,admission_number,first_name,middle_name,last_name,status)")
    .eq("parent_id", parentId);

  if (linksError) throw linksError;

  const baseChildren = (links ?? [])
    .map((link) => relationOne(link.students))
    .filter((student): student is NonNullable<typeof student> => Boolean(student));
  const studentIds = baseChildren.map((student) => student.id);
  if (studentIds.length === 0) return { children: [] };

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const [membershipsResult, sessionsResult, homeworkResult, attendanceResult] = await Promise.all([
    supabase
      .from("cohort_students")
      .select("student_id,cohorts!inner(id,code,name,status,teaching_assignments!inner(programmes!inner(id,name)))")
      .in("student_id", studentIds)
      .eq("status", "active"),
    supabase
      .from("cohort_students")
      .select("student_id,cohorts!inner(class_sessions!inner(id,title,session_date,start_time,end_time,meeting_link,status),code,teaching_assignments!inner(programmes!inner(name)))")
      .in("student_id", studentIds)
      .eq("status", "active")
      .gte("cohorts.class_sessions.session_date", today)
      .eq("cohorts.class_sessions.status", "scheduled"),
    supabase
      .from("homework_submissions")
      .select("id,student_id,status,homework!inner(id,title,instructions,due_at,maximum_score,status,class_sessions!inner(title,cohorts!inner(teaching_assignments!inner(programmes!inner(name)))))")
      .in("student_id", studentIds)
      .eq("homework.status", "published")
      .order("created_at", { ascending: false }),
    supabase
      .from("session_attendance")
      .select("id,student_id,status,class_sessions!inner(title,session_date,cohorts!inner(teaching_assignments!inner(programmes!inner(name))))")
      .in("student_id", studentIds)
      .order("created_at", { ascending: false }),
  ]);

  for (const result of [membershipsResult, sessionsResult, homeworkResult, attendanceResult]) {
    if (result.error) throw result.error;
  }

  const children: ParentDashboardChild[] = baseChildren.map((student) => {
    const programmes = (membershipsResult.data ?? [])
      .filter((row) => row.student_id === student.id)
      .flatMap((row) => {
        const cohort = relationOne(row.cohorts);
        const assignment = relationOne(cohort?.teaching_assignments);
        const programme = relationOne(assignment?.programmes);
        return cohort && programme
          ? [{ id: programme.id, name: programme.name, cohortCode: cohort.code, cohortName: cohort.name }]
          : [];
      });

    const upcomingSessions = (sessionsResult.data ?? [])
      .filter((row) => row.student_id === student.id)
      .flatMap((row) => {
        const cohort = relationOne(row.cohorts);
        const assignment = relationOne(cohort?.teaching_assignments);
        const programme = relationOne(assignment?.programmes);
        const sessions = Array.isArray(cohort?.class_sessions) ? cohort.class_sessions : cohort?.class_sessions ? [cohort.class_sessions] : [];
        return sessions.map((session) => ({
          id: session.id,
          title: session.title,
          programmeName: programme?.name ?? "Programme",
          cohortCode: cohort?.code ?? "",
          sessionDate: session.session_date,
          startTime: session.start_time,
          endTime: session.end_time,
          meetingLink: session.meeting_link,
        }));
      })
      .sort((a, b) => `${a.sessionDate}T${a.startTime}`.localeCompare(`${b.sessionDate}T${b.startTime}`))
      .slice(0, 8);

    const homework = (homeworkResult.data ?? [])
      .filter((row) => row.student_id === student.id)
      .flatMap((row) => {
        const item = relationOne(row.homework);
        const session = relationOne(item?.class_sessions);
        const cohort = relationOne(session?.cohorts);
        const assignment = relationOne(cohort?.teaching_assignments);
        const programme = relationOne(assignment?.programmes);
        return item
          ? [{
              id: item.id,
              title: item.title,
              instructions: item.instructions,
              dueAt: item.due_at,
              maximumScore: item.maximum_score == null ? null : Number(item.maximum_score),
              status: row.status,
              programmeName: programme?.name ?? "Programme",
              sessionTitle: session?.title ?? "Session",
            }]
          : [];
      })
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt));

    const attendanceRows = (attendanceResult.data ?? []).filter((row) => row.student_id === student.id);
    const counts = { present: 0, absent: 0, late: 0, pending: 0 };
    attendanceRows.forEach((row) => { counts[row.status] += 1; });
    const marked = counts.present + counts.absent + counts.late;
    const attended = counts.present + counts.late;
    const recent = attendanceRows.slice(0, 8).map((row) => {
      const session = relationOne(row.class_sessions);
      const cohort = relationOne(session?.cohorts);
      const assignment = relationOne(cohort?.teaching_assignments);
      const programme = relationOne(assignment?.programmes);
      return {
        id: row.id,
        status: row.status,
        sessionTitle: session?.title ?? "Session",
        programmeName: programme?.name ?? "Programme",
        sessionDate: session?.session_date ?? "",
      };
    });

    return {
      id: student.id,
      admissionNumber: student.admission_number,
      firstName: student.first_name,
      middleName: student.middle_name,
      lastName: student.last_name,
      fullName: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(" "),
      programmes,
      upcomingSessions,
      homework,
      attendance: {
        ...counts,
        marked,
        attended,
        rate: marked > 0 ? Math.round((attended / marked) * 100) : null,
        recent,
      },
    };
  });

  return { children };
}
