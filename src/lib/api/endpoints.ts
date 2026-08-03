export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    setPassword: "/auth/set-password",
  },
  admin: {
    teachers: "/admin/teachers",
    teacher: (id: string) => `/admin/teachers/${id}`,
    teacherActions: (id: string) => `/admin/teachers/${id}/actions`,
    students: "/admin/students",
    student: (id: string) => `/admin/students/${id}`,
    studentPhoto: (id: string) => `/admin/students/${id}/photo`,
    parents: "/admin/parents",
    parent: (id: string) => `/admin/parents/${id}`,
    parentActions: (id: string) => `/admin/parents/${id}/actions`,
    programmes: "/admin/programmes",
    programme: (id: string) => `/admin/programmes/${id}`,
  },
  profile: {
    root: "/profile",
    avatar: "/profile/avatar",
    password: "/profile/password",
  },
} as const;
