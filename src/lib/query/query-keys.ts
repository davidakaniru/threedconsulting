import { createEntityQueryKeys } from "@/lib/modules";

const teacherKeys = createEntityQueryKeys("teachers");
const studentKeys = createEntityQueryKeys("students");
const parentKeys = createEntityQueryKeys("parents");
const programmeKeys = createEntityQueryKeys("programmes");
const teachingAssignmentKeys = createEntityQueryKeys("teaching-assignments");
const cohortKeys = createEntityQueryKeys("cohorts");
const enrolmentKeys = createEntityQueryKeys("enrolments");

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    currentUser: () => ["auth", "current-user"] as const,
  },
  teachers: teacherKeys,
  students: studentKeys,
  parents: parentKeys,
  programmes: programmeKeys,
  teachingAssignments: teachingAssignmentKeys,
  cohorts: cohortKeys,
  enrolments: enrolmentKeys,
  profile: {
    all: ["profile"] as const,
    detail: () => ["profile", "detail"] as const,
  },
} as const;
