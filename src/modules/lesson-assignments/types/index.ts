export type LessonAssignmentStatus = "active" | "completed" | "cancelled";
export interface LessonAssignmentView {
  id: string;
  lessonRequestId: string;
  teacherId: string;
  teacherName: string;
  teacherQualification: string | null;
  teacherSpecialization: string | null;
  studentId: string;
  studentName: string;
  parentId: string;
  programme: { id: string; name: string; slug: string };
  preferredDays: string[];
  sessionTime: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  status: LessonAssignmentStatus;
}
