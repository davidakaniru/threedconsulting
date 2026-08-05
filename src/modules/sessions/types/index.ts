import type { Enums } from "@/types/database";
export type ClassSessionStatus=Enums<"class_session_status">;
export interface AttendanceSummary{pending:number;present:number;absent:number;late:number;total:number}
export interface HomeworkSummary{total:number;draft:number;published:number;closed:number}
export interface ClassSession{ id:string;cohortId:string;title:string;description:string|null;sessionDate:string;startTime:string;endTime:string;meetingLink:string;status:ClassSessionStatus;createdBy:string;createdAt:string;updatedAt:string;cohort:{id:string;code:string;name:string;programme:{id:string;name:string};teacher:{id:string;name:string}};attendance:AttendanceSummary;homework:HomeworkSummary }
export interface SessionListResult{sessions:ClassSession[];total:number;page:number;pageSize:number}
export interface SessionMetrics{total:number;draft:number;scheduled:number;completed:number;cancelled:number}
