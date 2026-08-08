import type { Enums } from "@/types/database";
export type HomeworkStatus=Enums<"homework_status">; export type HomeworkSubmissionStatus=Enums<"homework_submission_status">;
export interface HomeworkSubmissionSummary { pending:number;submitted:number;graded:number;late:number;total:number }
export interface Homework { id:string;sessionId:string;title:string;instructions:string;dueAt:string;maximumScore:number|null;status:HomeworkStatus;createdBy:string;createdAt:string;updatedAt:string;session:{id:string;title:string;sessionDate:string;lesson:{id:string;student:{id:string;name:string};programme:{id:string;name:string};teacher:{id:string;name:string}}};submissions:HomeworkSubmissionSummary }
export interface HomeworkListResult { homework:Homework[];total:number;page:number;pageSize:number }
