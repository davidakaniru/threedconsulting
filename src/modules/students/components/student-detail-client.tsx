"use client";
import { LoadingState, TableError } from "@/components/admin/ui";
import { useStudent } from "@/modules/students/hooks";
import { StudentDetails } from "./student-details";
export function StudentDetailClient({ id }: { id: string }) { const query=useStudent(id); if(query.isLoading)return <LoadingState variant="cards"/>; if(query.isError||!query.data)return <TableError title="Student could not be loaded" description="Please try again." onRetry={()=>void query.refetch()}/>; return <StudentDetails student={query.data} parents={query.data.parents??[]}/>; }
