
export type TutorApplicationStatus =
  | "pending"
  | "reviewing"
  | "accepted"
  | "rejected";

export interface TutorApplicationResult {
  id: string;
  status: TutorApplicationStatus;
}


export interface AdminTutorApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  expertise: string;
  qualifications: string;
  status: TutorApplicationStatus;
  createdAt: string;
}
