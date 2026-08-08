import { getHomeworkList } from "@/modules/homework/server";
import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";
import { getSessions } from "@/modules/sessions/server";
import { getTeachingAssignments } from "@/modules/teaching-assignments/server";
import type { TeacherDashboardData } from "../types";

function sessionStart(session: { sessionDate: string; startTime: string }) {
  return new Date(`${session.sessionDate}T${session.startTime}`);
}

export async function getTeacherDashboard(teacherId: string): Promise<TeacherDashboardData> {
  const [assignmentResult, lessons, sessionResult, homeworkResult] = await Promise.all([
    getTeachingAssignments({ teacherId, status: "active" }),
    getTeacherLessonAssignments(teacherId),
    getSessions({ teacherId, page: 1, pageSize: 100 }),
    getHomeworkList({ teacherId, page: 1, pageSize: 100 }),
  ]);

  const now = new Date();
  const activeLessons = lessons.filter((lesson) => lesson.status === "active");
  const upcomingSessions = sessionResult.sessions
    .filter((session) => session.status === "scheduled" && sessionStart(session) >= now)
    .sort((a, b) => sessionStart(a).getTime() - sessionStart(b).getTime())
    .slice(0, 5);
  const attendanceAttention = sessionResult.sessions
    .filter((session) => (session.status === "scheduled" || session.status === "completed") && session.attendance.pending > 0 && session.attendance.total > 0)
    .sort((a, b) => sessionStart(b).getTime() - sessionStart(a).getTime())
    .slice(0, 5);
  const homeworkDue = homeworkResult.homework
    .filter((homework) => homework.status === "published")
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5);

  return {
    metrics: {
      programmes: assignmentResult.assignments.length,
      activeLessons: activeLessons.length,
      upcomingSessions: upcomingSessions.length,
      attendancePending: attendanceAttention.length,
    },
    assignments: assignmentResult.assignments,
    lessons: activeLessons,
    upcomingSessions,
    attendanceAttention,
    homeworkDue,
  };
}
