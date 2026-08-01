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
  },
  profile: {
    root: "/profile",
    avatar: "/profile/avatar",
    password: "/profile/password",
  },
} as const;
