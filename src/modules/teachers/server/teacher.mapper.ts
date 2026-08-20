import { firstRelation, textOrFallback } from "@/lib/mappers";
import type { TeacherDetail, TeacherSummary } from "@/modules/teachers/types";
import type { Tables } from "@/types/database";

type TeacherRow = Tables<"teachers">;
type ProfileRow = Pick<
  Tables<"profiles">,
  | "first_name"
  | "last_name"
  | "email"
  | "avatar_url"
  | "status"
  | "phone"
  | "address"
  | "date_of_birth"
>;

export type TeacherJoinedRow = TeacherRow & {
  profiles: ProfileRow | ProfileRow[] | null;
};

export function mapTeacherSummary(row: TeacherJoinedRow): TeacherSummary {
  const profile = firstRelation(row.profiles);

  return {
    id: row.id,
    employeeId: row.employee_id,
    firstName: profile?.first_name ?? null,
    lastName: profile?.last_name ?? null,
    email: textOrFallback(profile?.email),
    avatarUrl: profile?.avatar_url ?? null,
    qualification: row.qualification,
    specialization: row.specialization,
    expertise: row.expertise ?? row.specialization,
    qualifications: row.qualifications ?? row.qualification,
    addressLine1: row.address_line_1,
    city: row.city,
    country: row.country,
    gender: row.gender === "male" || row.gender === "female" ? row.gender : null,
    summary: row.summary,
    cvPath: row.cv_path,
    hireDate: row.hire_date,
    employmentStatus: row.employment_status,
    onboardingStatus: row.onboarding_status,
    accountStatus: profile?.status ?? "inactive",
    invitedAt: row.invited_at,
    activatedAt: row.activated_at,
    createdAt: row.created_at,
  };
}

export function mapTeacherDetail(row: TeacherJoinedRow): TeacherDetail {
  const profile = firstRelation(row.profiles);

  return {
    ...mapTeacherSummary(row),
    phone: profile?.phone ?? null,
    address: profile?.address ?? null,
    dateOfBirth: profile?.date_of_birth ?? null,
    updatedAt: row.updated_at,
  };
}
