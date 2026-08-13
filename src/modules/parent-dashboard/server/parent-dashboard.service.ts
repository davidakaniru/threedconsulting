import { createAdminClient } from "@/lib/supabase/admin";
import type { ParentAcademicDashboard, ParentDashboardChild } from "../types";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

export async function getParentAcademicDashboard(
  parentId: string,
): Promise<ParentAcademicDashboard> {
  const supabase = createAdminClient() as any;
  const { data: links, error: linksError } = await supabase
    .from("student_parents")
    .select(
      "student_id,students!inner(id,admission_number,first_name,middle_name,last_name,current_education_level,status)",
    )
    .eq("parent_id", parentId);

  if (linksError) throw linksError;

  const baseChildren = (links ?? [])
    .map((link: any) => relationOne(link.students))
    .filter((student: any): student is NonNullable<typeof student> =>
      Boolean(student),
    );
  const studentIds = baseChildren.map((student: any) => student.id);
  if (studentIds.length === 0) return { children: [] };

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const [assignmentsResult, sessionsResult, attendanceResult] = await Promise.all([
      supabase
        .from("lesson_assignments")
        .select(
          "id,student_id,status,current_education_level,preferred_days,session_time,start_date,end_date,programmes!inner(id,name),teachers!inner(qualification,specialization,profiles!inner(first_name,last_name))",
        )
        .eq("parent_id", parentId)
        .in("student_id", studentIds)
        .in("status", ["active", "completed"]),
      supabase
        .from("class_sessions")
        .select(
          "id,title,session_date,start_time,end_time,meeting_link,status,lesson_assignments!inner(id,student_id,parent_id,programmes!inner(id,name))",
        )
        .not("lesson_assignment_id", "is", null)
        .eq("lesson_assignments.parent_id", parentId)
        .in("lesson_assignments.student_id", studentIds)
        .gte("session_date", today)
        .eq("status", "scheduled")
        .order("session_date", { ascending: true })
        .order("start_time", { ascending: true }),
      supabase
        .from("session_attendance")
        .select(
          "id,student_id,status,class_sessions!inner(title,session_date,lesson_assignments!inner(programmes!inner(name)))",
        )
        .in("student_id", studentIds)
        .not("class_sessions.lesson_assignment_id", "is", null)
        .order("created_at", { ascending: false }),
    ]);

  for (const result of [
    assignmentsResult,
    sessionsResult,
    attendanceResult,
  ]) {
    if (result.error) throw result.error;
  }

  const children: ParentDashboardChild[] = baseChildren.map((student: any) => {
    const programmes = (assignmentsResult.data ?? [])
      .filter(
        (row: any) => row.student_id === student.id && row.status === "active",
      )
      .flatMap((row: any) => {
        const programme = relationOne(row.programmes) as any;
        const teacher = relationOne(row.teachers) as any;
        const profile = relationOne(teacher?.profiles) as any;
        return programme
          ? [
              {
                id: programme.id,
                name: programme.name,
                assignmentId: row.id,
                teacherName:
                  [profile?.first_name, profile?.last_name]
                    .filter(Boolean)
                    .join(" ") || "Teacher",
                teacherQualification: teacher?.qualification ?? null,
                teacherSpecialization: teacher?.specialization ?? null,
                currentEducationLevel: row.current_education_level,
                preferredDays: row.preferred_days ?? [],
                sessionTime: row.session_time,
                startDate: row.start_date,
                endDate: row.end_date,
              },
            ]
          : [];
      });

    const upcomingSessions = (sessionsResult.data ?? [])
      .flatMap((row: any) => {
        const assignment = relationOne(row.lesson_assignments) as any;
        if (!assignment || assignment.student_id !== student.id) return [];
        const programme = relationOne(assignment.programmes) as any;
        return [
          {
            id: row.id,
            title: row.title,
            programmeName: programme?.name ?? "Programme",
            sessionDate: row.session_date,
            startTime: row.start_time,
            endTime: row.end_time,
          },
        ];
      })
      .sort((a: any, b: any) =>
        `${a.sessionDate}T${a.startTime}`.localeCompare(
          `${b.sessionDate}T${b.startTime}`,
        ),
      )
      .slice(0, 8);

    const attendanceRows = (attendanceResult.data ?? []).filter(
      (row: any) => row.student_id === student.id,
    );
    const counts = { present: 0, absent: 0, late: 0, pending: 0 };
    attendanceRows.forEach((row: any) => {
      if (row.status in counts) counts[row.status as keyof typeof counts] += 1;
    });
    const marked = counts.present + counts.absent + counts.late;
    const attended = counts.present + counts.late;
    const recent = attendanceRows.slice(0, 8).map((row: any) => {
      const session = relationOne(row.class_sessions) as any;
      const assignment = relationOne(session?.lesson_assignments) as any;
      const programme = relationOne(assignment?.programmes) as any;
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
      fullName: [student.first_name, student.middle_name, student.last_name]
        .filter(Boolean)
        .join(" "),
      currentEducationLevel: student.current_education_level ?? null,
      programmes,
      upcomingSessions,
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
