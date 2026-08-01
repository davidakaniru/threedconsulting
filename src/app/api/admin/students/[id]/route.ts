import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAdmin } from "@/lib/auth/guards";
import { updateStudentSchema } from "@/modules/students/schemas";
import { getStudent, updateStudent } from "@/modules/students/server";
export const runtime="nodejs";type Context={params:Promise<{id:string}>};
export async function GET(_:NextRequest,c:Context){try{await requireApiAdmin();return apiSuccess(await getStudent((await c.params).id));}catch(error){if(error instanceof ApiError)return apiError(error.code,error.message,error.status,error.details);console.error("Student GET failed",error);return apiError("INTERNAL_SERVER_ERROR","Unable to load the student.",500);}}
export async function PATCH(request:NextRequest,c:Context){try{await requireApiAdmin();const input=await updateStudentSchema.validate(await request.json(),{abortEarly:false,stripUnknown:true});return apiSuccess(await updateStudent((await c.params).id,input));}catch(error){if(error instanceof ValidationError){const details=error.inner.reduce<Record<string,string>>((a,i)=>{if(i.path&&!a[i.path])a[i.path]=i.message;return a;},{});return apiError("VALIDATION_ERROR","Please correct the highlighted fields.",422,details);}if(error instanceof ApiError)return apiError(error.code,error.message,error.status,error.details);console.error("Student PATCH failed",error);return apiError("INTERNAL_SERVER_ERROR","Unable to update the student.",500);}}
