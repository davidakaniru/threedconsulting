import type { Enums } from "@/types/database";
import type { ProfileStatus } from "@/types/auth";

export type TeacherEmploymentStatus = Enums<"teacher_employment_status">;
export type TeacherOnboardingStatus = Enums<"teacher_onboarding_status">;

export interface TeacherSummary {
  id: string;
  employeeId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarUrl: string | null;
  qualification: string | null;
  specialization: string | null;
  expertise: string | null;
  qualifications: string | null;
  addressLine1: string | null;
  city: string | null;
  country: string | null;
  gender: "male" | "female" | null;
  summary: string | null;
  cvPath: string | null;
  hireDate: string;
  employmentStatus: TeacherEmploymentStatus;
  onboardingStatus: TeacherOnboardingStatus;
  accountStatus: ProfileStatus;
  invitedAt: string;
  activatedAt: string | null;
  createdAt: string;
}

export interface TeacherDetail extends TeacherSummary {
  phone: string | null;
  address: string | null;
  dateOfBirth: string | null;
  updatedAt: string;
}

export interface TeacherListResult {
  teachers: TeacherSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export type TeacherAction =
  | { type: "employment_status"; status: TeacherEmploymentStatus }
  | { type: "account_status"; status: ProfileStatus }
  | { type: "resend_invitation" };

export interface TeacherMetricsI {
  total: number;
  active: number;
  invited: number;
  onLeave: number;
}
