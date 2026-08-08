export type ParentDashboardChild = {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  programmes: Array<{
    id: string;
    name: string;
    assignmentId: string;
    teacherName: string;
    teacherQualification: string | null;
    teacherSpecialization: string | null;
    preferredDays: string[];
    sessionTime: string;
    startDate: string;
    endDate: string;
  }>;
  upcomingSessions: Array<{
    id: string;
    title: string;
    programmeName: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    meetingLink: string;
  }>;
  homework: Array<{
    id: string;
    title: string;
    instructions: string;
    dueAt: string;
    maximumScore: number | null;
    status: "pending" | "submitted" | "graded" | "late";
    programmeName: string;
    sessionTitle: string;
  }>;
  attendance: {
    present: number;
    absent: number;
    late: number;
    pending: number;
    attended: number;
    marked: number;
    rate: number | null;
    recent: Array<{
      id: string;
      status: "pending" | "present" | "absent" | "late";
      sessionTitle: string;
      programmeName: string;
      sessionDate: string;
    }>;
  };
};

export type ParentAcademicDashboard = {
  children: ParentDashboardChild[];
};
