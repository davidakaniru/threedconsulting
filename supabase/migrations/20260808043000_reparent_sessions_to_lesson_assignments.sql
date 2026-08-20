alter table public.class_sessions add column lesson_assignment_id uuid references public.lesson_assignments(id) on delete restrict;
alter table public.class_sessions alter column cohort_id drop not null;
alter table public.class_sessions add constraint class_sessions_teaching_context_check check (lesson_assignment_id is not null or cohort_id is not null);
create index class_sessions_lesson_assignment_date_idx on public.class_sessions(lesson_assignment_id,session_date desc,start_time desc) where lesson_assignment_id is not null;

create or replace function private.populate_session_attendance() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.status='scheduled'::public.class_session_status and (tg_op='INSERT' or old.status is distinct from new.status) then
  if new.lesson_assignment_id is not null then
   insert into public.session_attendance(session_id,student_id,status) select new.id,la.student_id,'pending'::public.attendance_status from public.lesson_assignments la where la.id=new.lesson_assignment_id and la.status='active'::public.lesson_assignment_status on conflict(session_id,student_id) do nothing;
  elsif new.cohort_id is not null then
   insert into public.session_attendance(session_id,student_id,status) select new.id,cs.student_id,'pending'::public.attendance_status from public.cohort_students cs where cs.cohort_id=new.cohort_id and cs.status='active'::public.cohort_membership_status on conflict(session_id,student_id) do nothing;
  end if;
 end if; return new;
end;$$;

create or replace function public.update_session_attendance(p_session_id uuid,p_teacher_id uuid,p_records jsonb) returns integer language plpgsql security definer set search_path='' as $$
declare v_session public.class_sessions%rowtype;v_authorized boolean:=false;v_record jsonb;v_attendance_id uuid;v_status public.attendance_status;v_notes text;v_updated_count integer:=0;
begin
 select * into v_session from public.class_sessions where id=p_session_id for update;
 if not found then raise exception 'Session not found or teacher is not authorized'; end if;
 if v_session.lesson_assignment_id is not null then select exists(select 1 from public.lesson_assignments la where la.id=v_session.lesson_assignment_id and la.teacher_id=p_teacher_id and la.status='active'::public.lesson_assignment_status) into v_authorized;
 elsif v_session.cohort_id is not null then select exists(select 1 from public.cohorts c join public.teaching_assignments ta on ta.id=c.teaching_assignment_id where c.id=v_session.cohort_id and ta.teacher_id=p_teacher_id and ta.status='active'::public.teaching_assignment_status) into v_authorized; end if;
 if not v_authorized then raise exception 'Session not found or teacher is not authorized'; end if;
 if v_session.status not in('scheduled'::public.class_session_status,'completed'::public.class_session_status) then raise exception 'Attendance can only be marked for scheduled or completed sessions'; end if;
 if jsonb_typeof(p_records)<>'array' then raise exception 'Attendance records must be an array'; end if;
 for v_record in select value from jsonb_array_elements(p_records) loop v_attendance_id:=(v_record->>'attendanceId')::uuid;v_status:=(v_record->>'status')::public.attendance_status;v_notes:=nullif(btrim(v_record->>'notes'),''); update public.session_attendance set status=v_status,notes=v_notes,marked_by=p_teacher_id,marked_at=now() where id=v_attendance_id and session_id=p_session_id; if not found then raise exception 'Attendance record does not belong to this session'; end if;v_updated_count:=v_updated_count+1; end loop; return v_updated_count;
end;$$;

create or replace function private.populate_homework_submissions() returns trigger language plpgsql security definer set search_path='' as $$
declare v_session public.class_sessions%rowtype;
begin
 if new.status='published'::public.homework_status and (tg_op='INSERT' or old.status is distinct from new.status) then select * into v_session from public.class_sessions where id=new.session_id;
  if v_session.lesson_assignment_id is not null then insert into public.homework_submissions(homework_id,student_id,status) select new.id,la.student_id,'pending'::public.homework_submission_status from public.lesson_assignments la where la.id=v_session.lesson_assignment_id on conflict(homework_id,student_id) do nothing;
  elsif v_session.cohort_id is not null then insert into public.homework_submissions(homework_id,student_id,status) select new.id,cs.student_id,'pending'::public.homework_submission_status from public.cohort_students cs where cs.cohort_id=v_session.cohort_id and cs.status='active'::public.cohort_membership_status on conflict(homework_id,student_id) do nothing; end if;
 end if;return new;
end;$$;
