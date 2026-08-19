export type TutorApplicationStatus =
  | "pending"
  | "reviewing"
  | "accepted"
  | "rejected";

export interface TutorApplicationSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  expertise: string;
  qualifications: string;
  profileImagePath: string;
  cvPath: string | null;
  summary: string;
  addressLine1: string;
  city: string;
  country: string;
  status: TutorApplicationStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}

export interface TutorApplicationListResult {
  applications: TutorApplicationSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TutorApplicationDetail extends TutorApplicationSummary {
  profileImageUrl: string | null;
  cvUrl: string | null;
}

export type TutorApplicationAction =
  | { type: "accept" }
  | { type: "reject"; reason?: string };

export interface TutorApplicationResult {
  id: string;
  status: TutorApplicationStatus;
  teacherId?: string;
  email?: string;
}
