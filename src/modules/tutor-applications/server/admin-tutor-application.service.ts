import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminTutorApplication } from "@/modules/tutor-applications/types";

export async function getTutorApplicationsForAdmin(): Promise<AdminTutorApplication[]> {
  const { data, error } = await createAdminClient()
    .from("tutor_applications")
    .select("id,first_name,last_name,email,phone,gender,expertise,qualifications,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load tutor applications", error);
    return [];
  }

  return ((data ?? []) as any[]).map((row) => ({
    id: row.id,
    name: [row.first_name, row.last_name].filter(Boolean).join(" ") || "Unnamed applicant",
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    expertise: row.expertise,
    qualifications: row.qualifications,
    status: row.status,
    createdAt: row.created_at,
  }));
}
