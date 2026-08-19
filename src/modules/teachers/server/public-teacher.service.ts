import { createAdminClient } from "@/lib/supabase/admin";

export interface PublicTutor {
  id: string;
  name: string;
  specialization: string | null;
  qualification: string | null;
  summary: string | null;
  avatarUrl: string | null;
  subjects: string[];
}

export async function getActiveTutorsForPublic(): Promise<PublicTutor[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("teachers")
    .select(
      "id,specialization,qualification,summary,profiles!inner(first_name,last_name,avatar_url),teaching_assignments(programmes(title,name))",
    )
    .eq("employment_status", "active")
    .eq("onboarding_status", "active")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    const assignments = Array.isArray(row.teaching_assignments)
      ? row.teaching_assignments
      : [];
    const subjects = assignments
      .map(
        (assignment: any) =>
          assignment.programmes?.title || assignment.programmes?.name,
      )
      .filter((value: unknown): value is string => typeof value === "string");

    return {
      id: row.id,
      name:
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        "Tutor",
      specialization: row.specialization,
      qualification: row.qualification,
      summary: row.summary,
      avatarUrl: profile?.avatar_url ?? null,
      subjects: Array.from(new Set(subjects)),
    } as PublicTutor;
  });
}
