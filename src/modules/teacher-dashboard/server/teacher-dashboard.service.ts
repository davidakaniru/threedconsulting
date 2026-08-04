import { getCohorts } from "@/modules/cohorts/server";
import { getHomeworkList } from "@/modules/homework/server";
import { getSessions } from "@/modules/sessions/server";
import { getTeachingAssignments } from "@/modules/teaching-assignments/server";
import type { TeacherDashboardData } from "../types";

function sessionStart(session: { sessionDate: string; startTime: string }) {
  return new Date(`${session.sessionDate}T${session.startTime}`);
}

export async function getTeacherDashboard(
  teacherId: string,
): Promise<TeacherDashboardData> {
  const [assignmentResult, cohortResult, sessionResult, homeworkResult] =
    await Promise.all([
      getTeachingAssignments({ teacherId, status: "active" }),
      getCohorts({ teacherId, page: 1, pageSize: 100 }),
      getSessions({ teacherId, page: 1, pageSize: 100 }),
      getHomeworkList({ teacherId, page: 1, pageSize: 100 }),
    ]);

  const now = new Date();
  const activeCohorts = cohortResult.cohorts.filter(
    (cohort) => cohort.status === "open" || cohort.status === "active",
  );

  const upcomingSessions = sessionResult.sessions
    .filter(
      (session) =>
        session.status === "scheduled" && sessionStart(session) >= now,
    )
    .sort(
      (left, right) =>
        sessionStart(left).getTime() - sessionStart(right).getTime(),
    )
    .slice(0, 5);

  const attendanceAttention = sessionResult.sessions
    .filter(
      (session) =>
        (session.status === "scheduled" || session.status === "completed") &&
        session.attendance.pending > 0 &&
        session.attendance.total > 0,
    )
    .sort(
      (left, right) =>
        sessionStart(right).getTime() - sessionStart(left).getTime(),
    )
    .slice(0, 5);

  const homeworkDue = homeworkResult.homework
    .filter((homework) => homework.status === "published")
    .sort(
      (left, right) =>
        new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime(),
    )
    .slice(0, 5);

  return {
    metrics: {
      programmes: assignmentResult.assignments.length,
      activeCohorts: activeCohorts.length,
      upcomingSessions: upcomingSessions.length,
      attendancePending: attendanceAttention.length,
    },
    assignments: assignmentResult.assignments,
    cohorts: activeCohorts,
    upcomingSessions,
    attendanceAttention,
    homeworkDue,
  };
}
