export type ParentOnboardingStatus = "invited" | "active";
export type GuardianRelationship =
  | "mother"
  | "father"
  | "guardian"
  | "foster_parent"
  | "other";
export type ParentAction =
  | { type: "account_status"; status: "active" | "inactive" | "suspended" }
  | { type: "resend_invitation" };
export interface LinkedStudent {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  relationship: GuardianRelationship;
  isPrimaryContact: boolean;
}
export interface ParentSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  onboardingStatus: ParentOnboardingStatus;
  accountStatus: "active" | "inactive" | "suspended";
  studentsCount: number;
  createdAt: string;
}
export interface ParentDetail extends ParentSummary {
  address: string | null;
  invitedAt: string;
  activatedAt: string | null;
  students: LinkedStudent[];
}
export interface ParentListResult {
  parents: ParentSummary[];
  total: number;
  page: number;
  pageSize: number;
}
export interface ParentMetricsI {
  total: number;
  active: number;
  invited: number;
  suspended: number;
}
