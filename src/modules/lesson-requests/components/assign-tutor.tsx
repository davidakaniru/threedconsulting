"use client";

import { useState } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toApiError } from "@/lib/api/errors";
import { useAssignLessonRequest, useEligibleTutors } from "../hooks";

export function AssignTutor({ requestId }: { requestId: string }) {
  const tutors = useEligibleTutors(requestId);
  const assign = useAssignLessonRequest(requestId);
  const [teacherId, setTeacherId] = useState("");

  async function submit() {
    if (!teacherId) return;
    try {
      await assign.mutateAsync(teacherId);
      toast.success("Tutor assigned to the enrolment.");
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select value={teacherId} onValueChange={setTeacherId} disabled={tutors.isLoading || assign.isPending}>
        <SelectTrigger className="sm:min-w-72"><SelectValue placeholder={tutors.isLoading ? "Loading eligible tutors..." : "Select an eligible tutor"} /></SelectTrigger>
        <SelectContent>
          {(tutors.data ?? []).map((tutor) => (
            <SelectItem key={tutor.id} value={tutor.id}>
              {tutor.name}{tutor.matchingSubject ? ` · ${tutor.matchingSubject}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" disabled={!teacherId || assign.isPending} onClick={submit}>
        <UserCheck /> {assign.isPending ? "Assigning..." : "Assign tutor"}
      </Button>
    </div>
  );
}
