import type { ReactNode } from "react";
import { requireTeacher } from "@/lib/auth/guards";

export default async function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireTeacher();
  return children;
}
