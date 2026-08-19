import type { LessonRequestStatus } from "./index";

export type LessonRequestProgramme = { id: string; name: string; slug: string };
export type EligibleTutor = { id: string; name: string; email: string; matchingSubject: string | null };

export type LessonRequestSummary = {
  id: string;
  childName: string;
  parentName: string;
  parentEmail: string;
  programme: LessonRequestProgramme;
  subjects: LessonRequestProgramme[];
  preferredDays: string[];
  preferredTime: string;
  durationMonths: number;
  status: LessonRequestStatus;
  createdAt: string;
};

export type LessonRequestDetail = LessonRequestSummary & {
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  currentEducationLevel: string;
  parentPhone: string | null;
  additionalMessage: string | null;
  reviewedAt: string | null;
  publishedAt: string | null;
  matchedTeacherId: string | null;
  matchedAt: string | null;
  matchedProgrammeId: string | null;
  matchedTutorName: string | null;
};

export type LessonRequestListResult = {
  requests: LessonRequestSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type LessonRequestMetricsI = {
  total: number;
  pendingReview: number;
  open: number;
  matched: number;
};
