alter table public.lesson_requests add column current_education_level text;
update public.lesson_requests set current_education_level = 'Not specified' where current_education_level is null;
alter table public.lesson_requests alter column current_education_level set not null;
alter table public.lesson_requests add constraint lesson_requests_current_education_level_length check (char_length(btrim(current_education_level)) between 1 and 100);

alter table public.lesson_assignments add column current_education_level text;
update public.lesson_assignments la set current_education_level = lr.current_education_level from public.lesson_requests lr where lr.id = la.lesson_request_id and la.current_education_level is null;
update public.lesson_assignments set current_education_level = 'Not specified' where current_education_level is null;
alter table public.lesson_assignments alter column current_education_level set not null;
alter table public.lesson_assignments add constraint lesson_assignments_current_education_level_length check (char_length(btrim(current_education_level)) between 1 and 100);

create or replace function private.ensure_lesson_assignment_for_request(p_request_id uuid)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare v_request public.lesson_requests%rowtype; v_student_id uuid; v_assignment_id uuid; v_has_primary boolean;
begin
 select * into v_request from public.lesson_requests where id=p_request_id for update;
 if not found then raise exception 'Enrolment not found'; end if;
 if v_request.matched_teacher_id is null then raise exception 'Enrolment has not been matched to a teacher'; end if;
 select id into v_assignment_id from public.lesson_assignments where lesson_request_id=v_request.id;
 if v_assignment_id is not null then return v_assignment_id; end if;
 v_student_id:=v_request.existing_student_id;
 if v_student_id is null then select s.id into v_student_id from public.students s join public.student_parents sp on sp.student_id=s.id where sp.parent_id=v_request.parent_id and lower(btrim(s.first_name))=lower(btrim(v_request.child_first_name)) and lower(btrim(s.last_name))=lower(btrim(v_request.child_last_name)) and s.date_of_birth=v_request.child_date_of_birth order by sp.is_primary_contact desc,s.created_at asc limit 1; end if;
 if v_student_id is null then insert into public.students(admission_number,first_name,last_name,date_of_birth,admission_date,status) values('',btrim(v_request.child_first_name),btrim(v_request.child_last_name),v_request.child_date_of_birth,current_date,'active'::public.student_status) returning id into v_student_id; end if;
 select exists(select 1 from public.student_parents where student_id=v_student_id and is_primary_contact=true) into v_has_primary;
 insert into public.student_parents(student_id,parent_id,relationship,is_primary_contact) values(v_student_id,v_request.parent_id,'guardian'::public.guardian_relationship,not v_has_primary) on conflict(student_id,parent_id) do nothing;
 update public.lesson_requests set existing_student_id=v_student_id where id=v_request.id and existing_student_id is null;
 insert into public.lesson_assignments(lesson_request_id,teacher_id,student_id,parent_id,programme_id,current_education_level,preferred_days,session_time,duration_months,start_date,end_date,status)
 values(v_request.id,v_request.matched_teacher_id,v_student_id,v_request.parent_id,v_request.programme_id,v_request.current_education_level,v_request.preferred_days,v_request.preferred_time,v_request.duration_months,coalesce(v_request.matched_at::date,current_date),(coalesce(v_request.matched_at::date,current_date)+make_interval(months=>v_request.duration_months))::date,'active'::public.lesson_assignment_status) returning id into v_assignment_id;
 return v_assignment_id;
end; $$;
