export type LessonRequestStatus = "pending_review" | "open" | "matched" | "active" | "completed" | "cancelled";

export type ParentLessonRequest = {
  id: string;
  childName: string;
  programme: { id: string; name: string; slug: string };
  preferredDays: string[];
  preferredTime: string;
  durationMonths: number;
  status: LessonRequestStatus;
  createdAt: string;
};
export * from "./admin";
