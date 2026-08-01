import { createEntityQueryKeys } from "@/lib/modules";

const teacherKeys = createEntityQueryKeys("teachers");
const studentKeys = createEntityQueryKeys("students");

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => ["auth", "current-user"] as const,
  },
  teachers: teacherKeys,
  students: studentKeys,
  profile: {
    all: ["profile"] as const,
    detail: () => ["profile", "detail"] as const,
  },
} as const;
