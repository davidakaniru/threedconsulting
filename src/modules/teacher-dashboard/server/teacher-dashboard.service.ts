import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";
import { getSessions } from "@/modules/sessions/server";
import { getTeachingAssignments } from "@/modules/teaching-assignments/server";
import type { TeacherDashboardData } from "../types";

function sessionStart(session: { sessionDate: string; startTime: string }) {
  return new Date(`${session.sessionDate}T${session.startTime}`);
}

export async function getTeacherDashboard(
  teacherId: string,
): Promise<TeacherDashboardData> {
  const [assignmentResult, lessons, sessionResult] = await Promise.all([
    getTeachingAssignments({ teacherId, status: "active" }),
    getTeacherLessonAssignments(teacherId),
    getSessions({ teacherId, page: 1, pageSize: 100 }),
  ]);

  const now = new Date();
  const allActiveLessons = lessons.filter((lesson) => lesson.status === "active");
  const activeLessons = [...allActiveLessons]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )
    .slice(0, 5);

  const allUpcomingSessions = sessionResult.sessions
    .filter(
      (session) =>
        session.status === "scheduled" && sessionStart(session) >= now,
    )
    .sort((a, b) => sessionStart(a).getTime() - sessionStart(b).getTime());
  const upcomingSessions = allUpcomingSessions.slice(0, 3);
  const allAttendanceAttention = sessionResult.sessions
    .filter(
      (session) =>
        (session.status === "scheduled" || session.status === "completed") &&
        session.attendance.pending > 0 &&
        session.attendance.total > 0,
    )
    .sort((a, b) => sessionStart(b).getTime() - sessionStart(a).getTime());
  const attendanceAttention = allAttendanceAttention.slice(0, 5);

  return {
    metrics: {
      programmes: assignmentResult.assignments.length,
      activeLessons: allActiveLessons.length,
      upcomingSessions: allUpcomingSessions.length,
      attendancePending: allAttendanceAttention.length,
    },
    assignments: assignmentResult.assignments,
    lessons: activeLessons,
    upcomingSessions,
    attendanceAttention,
  };
}
