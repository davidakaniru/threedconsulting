export type LessonRequestStatus =
  | "pending_review"
  | "open"
  | "matched"
  | "active"
  | "completed"
  | "cancelled";

export type ParentEnrolmentChild = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  currentEducationLevel: string;
};

export type ParentLessonRequest = {
  id: string;
  studentId: string | null;
  childName: string;
  currentEducationLevel: string;
  programme: { id: string; name: string; slug: string };
  subjects: { id: string; name: string; slug: string }[];
  preferredDays: string[];
  preferredTime: string;
  durationMonths: number;
  status: LessonRequestStatus;
  createdAt: string;
};
export * from "./admin";

export type TeacherOpportunity = {
  id: string;
  childName: string;
  currentEducationLevel: string;
  programme: { id: string; name: string; slug: string };
  subjects: { id: string; name: string; slug: string }[];
  matchedProgrammeId: string | null;
  preferredDays: string[];
  preferredTime: string;
  durationMonths: number;
  additionalMessage: string | null;
  publishedAt: string | null;
  status: string;
};
