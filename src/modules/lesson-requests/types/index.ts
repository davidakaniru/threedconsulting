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
  preferredDays: string[];
  preferredTime: string;
  durationMonths: number;
  status: LessonRequestStatus;
  createdAt: string;
};
export * from "./admin";
