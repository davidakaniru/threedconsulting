export interface TeacherMonthlyActivity {
  teacherId: string;
  teacherName: string;
  email: string;
  studentsTaught: number;
  sessionsTotal: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  draft: number;
  programmes: Array<{ name: string; sessions: number }>;
  sessions: Array<{
    id: string;
    title: string;
    date: string;
    startTime: string;
    status: string;
    studentName: string;
    programmeName: string;
  }>;
}
export interface MonthlyTeacherReport {
  month: string;
  label: string;
  totals: {
    teachers: number;
    students: number;
    sessions: number;
    completed: number;
    cancelled: number;
  };
  teachers: TeacherMonthlyActivity[];
}
