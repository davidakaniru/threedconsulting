export type LessonReview = {
  id: string;
  lessonAssignmentId: string;
  parentId: string;
  rating: number;
  lessonOutcome: string;
  teacherFeedback: string;
  wouldRecommend: boolean;
  additionalComments: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ParentReviewContext = {
  assignmentId: string;
  childName: string;
  teacherName: string;
  programmeName: string;
  completedSessions: number;
  eligible: boolean;
  review: LessonReview | null;
};

export type LessonReviewAdminView = LessonReview & {
  parentName: string;
  parentEmail: string;
  childName: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  programmeId: string;
  programmeName: string;
  assignmentStartDate: string;
  assignmentEndDate: string;
};
