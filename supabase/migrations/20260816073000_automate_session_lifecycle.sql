-- Automate class-session lifecycle and attendance from actual meeting participation.

create table if not exists public.session_joins (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.class_sessions(id) on delete cascade,
  participant_type text not null check (participant_type in ('teacher','student')),
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint session_joins_unique_participant unique (session_id, participant_type)
);
create index if not exists session_joins_session_idx on public.session_joins(session_id);
create index if not exists session_joins_session_type_idx on public.session_joins(session_id, participant_type);

alter table public.session_joins enable row level security;
revoke all on public.session_joins from anon, authenticated;
grant all on public.session_joins to service_role;

-- Remove legacy functions that depend on the old attendance enum before replacing it.
drop function if exists public.update_session_attendance(uuid, uuid, jsonb);
drop trigger if exists class_sessions_populate_attendance on public.class_sessions;
drop function if exists private.populate_session_attendance();

-- Attendance is now binary: a student is either present or absent.
alter type public.attendance_status rename to attendance_status_legacy;
create type public.attendance_status as enum ('present','absent');
alter table public.session_attendance
  alter column status drop default;
alter table public.session_attendance
  alter column status type public.attendance_status
  using (
    case status::text
      when 'late' then 'present'::public.attendance_status
      when 'present' then 'present'::public.attendance_status
      else 'absent'::public.attendance_status
    end
  );
alter table public.session_attendance
  alter column status set default 'absent'::public.attendance_status;
drop type public.attendance_status_legacy;

-- Future scheduled sessions should not count as absent before they finish.
delete from public.session_attendance sa
using public.class_sessions cs
where sa.session_id = cs.id
  and cs.status = 'scheduled'::public.class_session_status
  and (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos' > now();

create or replace function public.record_session_join(
  p_session_id uuid,
  p_participant_type text,
  p_joined_at timestamptz default now()
)
returns public.class_sessions
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.class_sessions%rowtype;
  v_start timestamptz;
  v_end timestamptz;
  v_student_id uuid;
  v_teacher_joined boolean;
  v_student_joined boolean;
begin
  if p_participant_type not in ('teacher','student') then raise exception 'Invalid participant type'; end if;
  select * into v_session from public.class_sessions where id = p_session_id for update;
  if not found then raise exception 'Session not found'; end if;
  if v_session.status <> 'scheduled'::public.class_session_status then raise exception 'Session is not currently scheduled'; end if;
  v_start := (v_session.session_date::text || ' ' || v_session.start_time::text)::timestamp at time zone 'Africa/Lagos';
  v_end := (v_session.session_date::text || ' ' || v_session.end_time::text)::timestamp at time zone 'Africa/Lagos';
  if p_joined_at < v_start - interval '5 minutes' or p_joined_at > v_end then raise exception 'Session join window is closed'; end if;

  insert into public.session_joins(session_id, participant_type, joined_at)
  values (p_session_id, p_participant_type, p_joined_at)
  on conflict (session_id, participant_type) do nothing;

  if p_participant_type = 'student' and v_session.lesson_assignment_id is not null then
    select student_id into v_student_id from public.lesson_assignments where id = v_session.lesson_assignment_id;
    insert into public.session_attendance(session_id, student_id, status, marked_by, marked_at)
    values (p_session_id, v_student_id, 'present'::public.attendance_status, null, p_joined_at)
    on conflict (session_id, student_id) do update
      set status = 'present'::public.attendance_status,
          marked_by = null,
          marked_at = p_joined_at,
          updated_at = now();
  end if;

  select exists(select 1 from public.session_joins where session_id=p_session_id and participant_type='teacher' and joined_at <= v_end) into v_teacher_joined;
  select exists(select 1 from public.session_joins where session_id=p_session_id and participant_type='student' and joined_at <= v_end) into v_student_joined;
  if v_teacher_joined and v_student_joined and p_joined_at >= v_start then
    update public.class_sessions set status='completed'::public.class_session_status, updated_at=now() where id=p_session_id;
    select * into v_session from public.class_sessions where id=p_session_id;
  end if;
  return v_session;
end;
$$;

revoke all on function public.record_session_join(uuid, text, timestamptz) from public, anon, authenticated;
grant execute on function public.record_session_join(uuid, text, timestamptz) to service_role;

-- Finalize every expired scheduled session. Both parties must have joined before the scheduled end.
create or replace function public.finalize_expired_class_sessions()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer := 0;
begin
  update public.class_sessions cs
  set status = case
    when exists (
      select 1 from public.session_joins j
      where j.session_id = cs.id
        and j.participant_type = 'teacher'
        and j.joined_at <= (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos'
    )
    and exists (
      select 1 from public.session_joins j
      where j.session_id = cs.id
        and j.participant_type = 'student'
        and j.joined_at <= (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos'
    ) then 'completed'::public.class_session_status
    else 'cancelled'::public.class_session_status
  end,
  updated_at = now()
  where cs.status = 'scheduled'::public.class_session_status
    and (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos' <= now();

  get diagnostics v_count = row_count;

  insert into public.session_attendance(session_id, student_id, status, marked_by, marked_at)
  select cs.id, la.student_id, 'absent'::public.attendance_status, null, now()
  from public.class_sessions cs
  join public.lesson_assignments la on la.id = cs.lesson_assignment_id
  where cs.status = 'cancelled'::public.class_session_status
    and not exists (
      select 1 from public.session_attendance sa
      where sa.session_id = cs.id and sa.student_id = la.student_id
    )
  on conflict (session_id, student_id) do nothing;

  return v_count;
end;
$$;

revoke all on function public.finalize_expired_class_sessions() from public, anon, authenticated;
grant execute on function public.finalize_expired_class_sessions() to service_role;

-- Supabase Cron runs the finalizer independently of browser activity.
create extension if not exists pg_cron with schema extensions;
do $cron$
begin
  if not exists (select 1 from cron.job where jobname = 'finalize-expired-class-sessions') then
    perform cron.schedule(
      'finalize-expired-class-sessions',
      '* * * * *',
      $$select public.finalize_expired_class_sessions();$$
    );
  end if;
end;
$cron$;
