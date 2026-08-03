export type EnrolmentStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "withdrawn";
export interface EnrolmentProgramme {
  id: string;
  name: string;
  slug: string;
}
export interface EnrolmentSummary {
  id: string;
  childName: string;
  parentName: string;
  email: string;
  status: EnrolmentStatus;
  submittedAt: string;
  programmes: EnrolmentProgramme[];
}
export interface EnrolmentDetail extends EnrolmentSummary {
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  preferredFormat: string;
  phone: string;
  additionalInformation: string | null;
  reviewNotes: string | null;
  approvedStudentId: string | null;
}
export interface EnrolmentListResult {
  applications: EnrolmentSummary[];
  total: number;
  page: number;
  pageSize: number;
}
export interface EnrolmentMetricsI {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
}
export interface CohortOption {
  id: string;
  code: string;
  name: string;
  programmeId: string;
  programmeName: string;
  memberCount: number;
  capacity: number;
  status: string;
}
