import type { Enums, Tables } from "@/types/database";

export type UserRole = Enums<"user_role">;
export type ProfileStatus = Enums<"profile_status">;
export type ProfileRow = Tables<"profiles">;

export interface UserProfile {
  id: ProfileRow["id"];
  email: ProfileRow["email"];
  firstName: ProfileRow["first_name"];
  lastName: ProfileRow["last_name"];
  role: ProfileRow["role"];
  status: ProfileRow["status"];
  avatarUrl: ProfileRow["avatar_url"];
  phone: ProfileRow["phone"];
  dateOfBirth: ProfileRow["date_of_birth"];
  address: ProfileRow["address"];
  preferredLanguage: "en";
  createdAt: ProfileRow["created_at"];
  updatedAt: ProfileRow["updated_at"];
}

export type AuthenticatedUser = UserProfile;

export interface LoginResponse {
  user: AuthenticatedUser;
}
