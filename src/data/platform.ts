export type PlatformAccent = "sky" | "teal" | "grape";

export type PlatformTone = "grass" | "sun" | "coral" | "sky" | "grape" | "teal";

export type PlatformDashboard = {
  role: string;
  accent: PlatformAccent;
  greeting: string;
  nav: {
    icon: string;
    label: string;
  }[];
  stats: {
    label: string;
    value: string;
    icon: string;
    tone: PlatformTone;
  }[];
  panelTitle: string;
  panelRows: {
    name: string;
    meta: string;
    status: string;
    tone: PlatformTone;
  }[];
  progress: {
    label: string;
    value: number;
    tone: PlatformTone;
  }[];
};

export const parentDash: PlatformDashboard = {
  role: "Parent Portal",
  accent: "sky",
  greeting: "Hi, Rebecca 👋",
  nav: [
    { icon: "LayoutDashboard", label: "Dashboard" },
    { icon: "User", label: "Child Profile" },
    { icon: "CalendarCheck", label: "Attendance" },
    { icon: "LineChart", label: "Progress" },
    { icon: "Calendar", label: "Calendar" },
    { icon: "CreditCard", label: "Payments" },
    { icon: "Award", label: "Certificates" },
    { icon: "MessageSquare", label: "Messages" },
  ],
  stats: [
    {
      label: "Attendance",
      value: "98%",
      icon: "CalendarCheck",
      tone: "grass",
    },
    {
      label: "Active lessons",
      value: "3",
      icon: "BookOpen",
      tone: "sky",
    },
    {
      label: "Certificates",
      value: "5",
      icon: "Award",
      tone: "sun",
    },
    {
      label: "Next class",
      value: "Tue 4pm",
      icon: "Clock",
      tone: "coral",
    },
  ],
  panelTitle: "Upcoming classes",
  panelRows: [
    {
      name: "Mathematics",
      meta: "with Amara · Tue 16:00",
      status: "Confirmed",
      tone: "grass",
    },
    {
      name: "Coding Club",
      meta: "with Daniel · Wed 17:00",
      status: "Confirmed",
      tone: "grass",
    },
    {
      name: "Science Lab",
      meta: "with Grace · Fri 15:30",
      status: "Pending",
      tone: "sun",
    },
  ],
  progress: [
    {
      label: "Mathematics",
      value: 82,
      tone: "sky",
    },
    {
      label: "Reading",
      value: 91,
      tone: "grass",
    },
    {
      label: "Coding",
      value: 68,
      tone: "coral",
    },
  ],
};

export const teacherDash: PlatformDashboard = {
  role: "Tutor Portal",
  accent: "teal",
  greeting: "Good morning, Daniel",
  nav: [
    { icon: "LayoutDashboard", label: "Today’s Classes" },
    { icon: "CalendarCheck", label: "Attendance" },
    { icon: "StickyNote", label: "Student Notes" },
    { icon: "BookOpen", label: "Lesson Planning" },
    { icon: "CalendarDays", label: "Timetable" },
    { icon: "BarChart3", label: "Reports" },
    { icon: "MessageSquare", label: "Messages" },
    { icon: "FolderOpen", label: "Resources" },
  ],
  stats: [
    {
      label: "Classes today",
      value: "4",
      icon: "CalendarDays",
      tone: "teal",
    },
    {
      label: "Students",
      value: "22",
      icon: "Users",
      tone: "sky",
    },
    {
      label: "To review",
      value: "9",
      icon: "ClipboardList",
      tone: "coral",
    },
    {
      label: "Messages",
      value: "3",
      icon: "MessageSquare",
      tone: "grape",
    },
  ],
  panelTitle: "Today’s classes",
  panelRows: [
    {
      name: "Coding · Year 5",
      meta: "10:00 · Room 2 · 6 students",
      status: "Now",
      tone: "coral",
    },
    {
      name: "Robotics · Year 6",
      meta: "13:00 · Lab · 5 students",
      status: "Upcoming",
      tone: "sky",
    },
    {
      name: "Coding Club",
      meta: "17:00 · Online · 8 students",
      status: "Upcoming",
      tone: "sky",
    },
  ],
  progress: [
    {
      label: "Class performance",
      value: 88,
      tone: "teal",
    },
    {
      label: "Attendance complete",
      value: 74,
      tone: "sun",
    },
    {
      label: "Lesson plans ready",
      value: 100,
      tone: "grass",
    },
  ],
};

export const adminDash: PlatformDashboard = {
  role: "Admin Platform",
  accent: "grape",
  greeting: "Welcome back, Admin",
  nav: [
    { icon: "LayoutDashboard", label: "Overview" },
    { icon: "Users", label: "Students" },
    { icon: "GraduationCap", label: "Tutors" },
    { icon: "ClipboardCheck", label: "Registrations" },
    { icon: "CalendarCheck", label: "Attendance" },
    { icon: "MessagesSquare", label: "Communication" },
    { icon: "CalendarDays", label: "Events" },
    { icon: "BarChart3", label: "Analytics" },
    { icon: "Wallet", label: "Finance" },
  ],
  stats: [
    {
      label: "Active students",
      value: "1,284",
      icon: "Users",
      tone: "grape",
    },
    {
      label: "Tutors",
      value: "124",
      icon: "GraduationCap",
      tone: "sky",
    },
    {
      label: "New this week",
      value: "38",
      icon: "ClipboardCheck",
      tone: "grass",
    },
    {
      label: "Revenue MTD",
      value: "£86k",
      icon: "Wallet",
      tone: "sun",
    },
  ],
  panelTitle: "Recent registrations",
  panelRows: [
    {
      name: "Oliver Grant",
      meta: "Mathematics · Age 11",
      status: "Approved",
      tone: "grass",
    },
    {
      name: "Sana Ahmed",
      meta: "Coding · Age 9",
      status: "Review",
      tone: "sun",
    },
    {
      name: "Leo Fernandez",
      meta: "Science · Age 8",
      status: "Approved",
      tone: "grass",
    },
  ],
  progress: [
    {
      label: "Enrolment target",
      value: 76,
      tone: "grape",
    },
    {
      label: "Capacity used",
      value: 64,
      tone: "sky",
    },
    {
      label: "Satisfaction",
      value: 98,
      tone: "grass",
    },
  ],
};
