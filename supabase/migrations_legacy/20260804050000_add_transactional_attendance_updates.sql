create or replace function public.update_session_attendance(
  p_session_id uuid,
  p_teacher_id uuid,
  p_records jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.class_sessions%rowtype;
  v_record jsonb;
  v_attendance_id uuid;
  v_status public.attendance_status;
  v_notes text;
  v_updated_count integer := 0;
begin
  select cs.* into v_session
  from public.class_sessions cs
  join public.cohorts c on c.id = cs.cohort_id
  join public.teaching_assignments ta on ta.id = c.teaching_assignment_id
  where cs.id = p_session_id
    and ta.teacher_id = p_teacher_id
    and ta.status = 'active'::public.teaching_assignment_status
  for update of cs;

  if not found then raise exception 'Session not found or teacher is not authorized'; end if;
  if v_session.status not in ('scheduled'::public.class_session_status,'completed'::public.class_session_status) then
    raise exception 'Attendance can only be marked for scheduled or completed sessions';
  end if;
  if jsonb_typeof(p_records) <> 'array' then raise exception 'Attendance records must be an array'; end if;

  for v_record in select value from jsonb_array_elements(p_records)
  loop
    v_attendance_id := (v_record ->> 'attendanceId')::uuid;
    v_status := (v_record ->> 'status')::public.attendance_status;
    v_notes := nullif(btrim(v_record ->> 'notes'), '');
    update public.session_attendance
    set status=v_status,notes=v_notes,marked_by=p_teacher_id,marked_at=now()
    where id=v_attendance_id and session_id=p_session_id;
    if not found then raise exception 'Attendance record does not belong to this session'; end if;
    v_updated_count := v_updated_count + 1;
  end loop;
  return v_updated_count;
end;
$$;
revoke all on function public.update_session_attendance(uuid,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.update_session_attendance(uuid,uuid,jsonb) to service_role;
