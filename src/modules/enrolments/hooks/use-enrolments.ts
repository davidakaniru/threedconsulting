"use client";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import {apiClient} from "@/lib/api/client";
import {API_ENDPOINTS} from "@/lib/api/endpoints";
import {queryKeys} from "@/lib/query/query-keys";
import type {ApiSuccess} from "@/lib/api/types";
import type {ApproveEnrolmentRequest} from "../schemas";
import type {CohortOption,EnrolmentDetail,EnrolmentListResult} from "../types";
export function useEnrolments(filters?:Record<string,unknown>){return useQuery({queryKey:queryKeys.enrolments.list(filters??{}),queryFn:async()=>(await apiClient.get<ApiSuccess<EnrolmentListResult>>(API_ENDPOINTS.admin.enrolments,{params:filters})).data.data});}
export function useEnrolment(id:string){return useQuery({queryKey:queryKeys.enrolments.detail(id),queryFn:async()=>(await apiClient.get<ApiSuccess<EnrolmentDetail>>(API_ENDPOINTS.admin.enrolment(id))).data.data,enabled:!!id});}
export function useApproveEnrolment(id:string){const c=useQueryClient();return useMutation({mutationFn:async(v:ApproveEnrolmentRequest)=>(await apiClient.post<ApiSuccess<{studentId:string}>>(API_ENDPOINTS.admin.enrolmentApprove(id),v)).data.data,onSuccess:async()=>{
  await Promise.all([
    c.invalidateQueries({queryKey:queryKeys.enrolments.all}),
    c.invalidateQueries({queryKey:queryKeys.cohorts.all}),
    c.invalidateQueries({queryKey:queryKeys.students.all}),
    c.invalidateQueries({queryKey:queryKeys.programmes.all}),
  ]);
}});}
export function useRejectEnrolment(id:string){const c=useQueryClient();return useMutation({mutationFn:async(reviewNotes:string)=>(await apiClient.post<ApiSuccess<{id:string}>>(API_ENDPOINTS.admin.enrolmentReject(id),{reviewNotes})).data.data,onSuccess:()=>c.invalidateQueries({queryKey:queryKeys.enrolments.all})});}
export function useCohortOptions(id:string){return useQuery({queryKey:[...queryKeys.enrolments.detail(id),"cohorts"],queryFn:async()=>(await apiClient.get<ApiSuccess<CohortOption[]>>(`${API_ENDPOINTS.admin.enrolment(id)}?options=cohorts`)).data.data,enabled:!!id});}
