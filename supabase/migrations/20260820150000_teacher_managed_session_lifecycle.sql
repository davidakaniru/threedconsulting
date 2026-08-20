-- Teacher session lifecycle hardening.
-- Session creation is always scheduled; status transitions are system-controlled.
-- Meeting joins are recorded by the trusted join endpoints and expired sessions are finalized by cron.

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
begin
  if p_participant_type not in ('teacher','student') then
    raise exception 'Invalid participant type';
  end if;

  select * into v_session
  from public.class_sessions
  where id = p_session_id
  for update;

  if not found then
    raise exception 'Session not found';
  end if;

  if v_session.status <> 'scheduled'::public.class_session_status then
    raise exception 'Session is not currently scheduled';
  end if;

  v_start := (v_session.session_date::text || ' ' || v_session.start_time::text)::timestamp at time zone 'Africa/Lagos';
  v_end := (v_session.session_date::text || ' ' || v_session.end_time::text)::timestamp at time zone 'Africa/Lagos';

  if p_joined_at < v_start - interval '5 minutes' or p_joined_at >= v_end then
    raise exception 'Session join window is closed';
  end if;

  insert into public.session_joins(session_id, participant_type, joined_at)
  values (p_session_id, p_participant_type, p_joined_at)
  on conflict (session_id, participant_type) do nothing;

  if p_participant_type = 'student' and v_session.lesson_assignment_id is not null then
    select student_id into v_student_id
    from public.lesson_assignments
    where id = v_session.lesson_assignment_id;

    insert into public.session_attendance(session_id, student_id, status, marked_by, marked_at)
    values (p_session_id, v_student_id, 'present'::public.attendance_status, null, p_joined_at)
    on conflict (session_id, student_id) do update
      set status = 'present'::public.attendance_status,
          marked_by = null,
          marked_at = p_joined_at,
          updated_at = now();
  end if;

  -- Completion is deliberately NOT decided at join time.
  -- finalize_expired_class_sessions() decides at/after end time.
  return v_session;
end;
$$;

revoke all on function public.record_session_join(uuid, text, timestamptz) from public, anon, authenticated;
grant execute on function public.record_session_join(uuid, text, timestamptz) to service_role;

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
        and j.joined_at < (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos'
    )
    and exists (
      select 1 from public.session_joins j
      where j.session_id = cs.id
        and j.participant_type = 'student'
        and j.joined_at < (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos'
    )
    then 'completed'::public.class_session_status
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

-- Keep the lifecycle finalizer running independently of browser activity.
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
