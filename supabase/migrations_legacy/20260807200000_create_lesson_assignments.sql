create type public.lesson_assignment_status as enum ('active','completed','cancelled');

create table public.lesson_assignments (
  id uuid primary key default gen_random_uuid(),
  lesson_request_id uuid not null unique references public.lesson_requests(id) on delete restrict,
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete restrict,
  parent_id uuid not null references public.parents(id) on delete restrict,
  programme_id uuid not null references public.programmes(id) on delete restrict,
  preferred_days text[] not null,
  session_time time not null,
  duration_months integer not null,
  start_date date not null,
  end_date date not null,
  status public.lesson_assignment_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_assignments_days_not_empty check (cardinality(preferred_days) between 1 and 6),
  constraint lesson_assignments_days_valid check (preferred_days <@ array['monday','tuesday','wednesday','thursday','friday','saturday']::text[]),
  constraint lesson_assignments_duration_check check (duration_months between 1 and 24),
  constraint lesson_assignments_date_order check (end_date >= start_date)
);

create index lesson_assignments_teacher_status_idx on public.lesson_assignments(teacher_id,status,created_at desc);
create index lesson_assignments_student_status_idx on public.lesson_assignments(student_id,status,created_at desc);
create index lesson_assignments_parent_status_idx on public.lesson_assignments(parent_id,status,created_at desc);
create index lesson_assignments_programme_status_idx on public.lesson_assignments(programme_id,status,created_at desc);

create trigger lesson_assignments_set_updated_at before update on public.lesson_assignments
for each row execute function private.set_updated_at();

alter table public.lesson_assignments enable row level security;
revoke all on public.lesson_assignments from anon, authenticated;
grant all on public.lesson_assignments to service_role;

create or replace function private.ensure_lesson_assignment_for_request(p_request_id uuid)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_request public.lesson_requests%rowtype;
  v_student_id uuid;
  v_assignment_id uuid;
  v_has_primary boolean;
begin
  select * into v_request from public.lesson_requests where id = p_request_id for update;
  if not found then raise exception 'Enrolment not found'; end if;
  if v_request.matched_teacher_id is null then raise exception 'Enrolment has not been matched to a teacher'; end if;

  select id into v_assignment_id from public.lesson_assignments where lesson_request_id = v_request.id;
  if v_assignment_id is not null then return v_assignment_id; end if;

  v_student_id := v_request.existing_student_id;
  if v_student_id is null then
    select s.id into v_student_id from public.students s
    join public.student_parents sp on sp.student_id = s.id
    where sp.parent_id = v_request.parent_id
      and lower(btrim(s.first_name)) = lower(btrim(v_request.child_first_name))
      and lower(btrim(s.last_name)) = lower(btrim(v_request.child_last_name))
      and s.date_of_birth = v_request.child_date_of_birth
    order by sp.is_primary_contact desc, s.created_at asc limit 1;
  end if;

  if v_student_id is null then
    insert into public.students(admission_number,first_name,last_name,date_of_birth,admission_date,status)
    values('',btrim(v_request.child_first_name),btrim(v_request.child_last_name),v_request.child_date_of_birth,current_date,'active'::public.student_status)
    returning id into v_student_id;
  end if;

  select exists(select 1 from public.student_parents where student_id = v_student_id and is_primary_contact = true) into v_has_primary;
  insert into public.student_parents(student_id,parent_id,relationship,is_primary_contact)
  values(v_student_id,v_request.parent_id,'guardian'::public.guardian_relationship,not v_has_primary)
  on conflict(student_id,parent_id) do nothing;

  update public.lesson_requests set existing_student_id = v_student_id where id = v_request.id and existing_student_id is null;

  insert into public.lesson_assignments(lesson_request_id,teacher_id,student_id,parent_id,programme_id,preferred_days,session_time,duration_months,start_date,end_date,status)
  values(v_request.id,v_request.matched_teacher_id,v_student_id,v_request.parent_id,v_request.programme_id,v_request.preferred_days,v_request.preferred_time,v_request.duration_months,coalesce(v_request.matched_at::date,current_date),(coalesce(v_request.matched_at::date,current_date) + make_interval(months => v_request.duration_months))::date,'active'::public.lesson_assignment_status)
  returning id into v_assignment_id;
  return v_assignment_id;
end;
$$;

create or replace function public.claim_open_lesson_request(p_lesson_request_id uuid,p_teacher_id uuid)
returns public.lesson_requests language plpgsql security definer set search_path = public, pg_temp as $$
declare v_request public.lesson_requests; v_is_eligible boolean;
begin
  select exists(select 1 from public.teaching_assignments ta join public.lesson_requests lr on lr.programme_id=ta.programme_id where lr.id=p_lesson_request_id and ta.teacher_id=p_teacher_id and ta.status='active') into v_is_eligible;
  if not v_is_eligible then raise exception 'Teacher is not eligible for this enrolment'; end if;
  update public.lesson_requests set status='matched',matched_teacher_id=p_teacher_id,matched_at=now() where id=p_lesson_request_id and status='open' and matched_teacher_id is null returning * into v_request;
  if v_request.id is null then raise exception 'This enrolment has already been taken'; end if;
  perform private.ensure_lesson_assignment_for_request(v_request.id);
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(p_teacher_id,'lesson_request.claimed','lesson_request',v_request.id,jsonb_build_object('teacher_id',p_teacher_id,'programme_id',v_request.programme_id));
  return v_request;
end; $$;
revoke all on function public.claim_open_lesson_request(uuid,uuid) from public,anon,authenticated;
grant execute on function public.claim_open_lesson_request(uuid,uuid) to service_role;

DO $$ declare v_request_id uuid; begin
  for v_request_id in select id from public.lesson_requests where matched_teacher_id is not null and status in ('matched'::public.lesson_request_status,'active'::public.lesson_request_status)
  loop perform private.ensure_lesson_assignment_for_request(v_request_id); end loop;
end $$;
