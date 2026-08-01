"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTeacherSchema, type CreateTeacherRequest } from "@/modules/teachers/schemas";
import { useCreateTeacher } from "@/modules/teachers/hooks";
import { toApiError } from "@/lib/api/errors";

export function CreateTeacherForm() {
 const router=useRouter(); const mutation=useCreateTeacher();
 const {register,handleSubmit,formState:{errors}}=useForm<CreateTeacherRequest>({resolver:yupResolver(createTeacherSchema),defaultValues:{firstName:"",lastName:"",email:"",employeeId:"",qualification:"",specialization:""},mode:"onTouched"});
 const submit=handleSubmit(async values=>{try{await mutation.mutateAsync(values);toast.success("Teacher invited successfully.");router.push("/portal/admin/teachers");}catch(e){toast.error(toApiError(e).message);}});
 return <form onSubmit={submit} noValidate className="space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Input id="firstName" label="First name" required errorMessage={errors.firstName?.message} {...register("firstName")} /><Input id="lastName" label="Last name" required errorMessage={errors.lastName?.message} {...register("lastName")} /><Input id="email" type="email" label="Email address" required errorMessage={errors.email?.message} {...register("email")} /><Input id="employeeId" label="Employee ID" required placeholder="e.g. TCH-001" errorMessage={errors.employeeId?.message} {...register("employeeId")} /><Input id="qualification" label="Qualification" placeholder="e.g. B.Ed Early Childhood Education" errorMessage={errors.qualification?.message} {...register("qualification")} /><Input id="specialization" label="Specialization" placeholder="e.g. Mathematics" errorMessage={errors.specialization?.message} {...register("specialization")} /></div><div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">The teacher will receive an account invitation by email. No password is sent or stored in plaintext.</div><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="outline" asChild><Link href="/portal/admin/teachers"><ArrowLeft />Cancel</Link></Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending?"Sending invitation...":<><Send />Add & invite teacher</>}</Button></div></form>;
}
