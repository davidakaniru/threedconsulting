export type ParentDashboardChild = {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  fullName: string;
  currentEducationLevel: string | null;
  programmes: Array<{
    id: string;
    name: string;
    assignmentId: string;
    teacherName: string;
    teacherQualification: string | null;
    teacherSpecialization: string | null;
    currentEducationLevel: string;
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
    status: string;
  }>;
  attendance: {
    present: number;
    absent: number;
    attended: number;
    marked: number;
    rate: number | null;
    recent: Array<{
      id: string;
      status: "present" | "absent";
      sessionTitle: string;
      programmeName: string;
      sessionDate: string;
    }>;
  };
};

export type ParentAcademicDashboard = {
  children: ParentDashboardChild[];
};
