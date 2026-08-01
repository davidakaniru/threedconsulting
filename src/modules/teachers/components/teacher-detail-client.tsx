"use client";

import { useTeacher } from "@/modules/teachers/hooks";
import { TableError, LoadingState } from "@/components/admin/ui";
import { TeacherDetails } from "@/modules/teachers/components/teacher-details";

export function TeacherDetailClient({ id }: { id: string }) {
  const query = useTeacher(id);
  if (query.isLoading) return <LoadingState variant="cards" />;
  if (query.isError || !query.data) return <TableError title="Teacher could not be loaded" description="Please try again." onRetry={() => void query.refetch()} />;
  return <TeacherDetails teacher={query.data} />;
}
