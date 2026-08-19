"use client";

import { useTeacher } from "@/modules/teachers/hooks";
import { LoadingState, SectionCard, TableError } from "@/components/admin/ui";
import { TeacherEditForm } from "@/modules/teachers/components/teacher-edit-form";

export function TeacherEditClient({ id }: { id: string }) {
  const query = useTeacher(id);
  if (query.isLoading) return <LoadingState variant="cards" />;
  if (query.isError || !query.data)
    return (
      <TableError
        title="Teacher could not be loaded"
        description="Please try again."
        onRetry={() => void query.refetch()}
      />
    );
  return (
    <SectionCard className="p-5 sm:p-8">
      <TeacherEditForm teacher={query.data} />
    </SectionCard>
  );
}
