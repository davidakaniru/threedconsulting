create or replace function public.claim_open_lesson_request(
  p_lesson_request_id uuid,
  p_teacher_id uuid
)
returns public.lesson_requests
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_request public.lesson_requests;
  v_is_eligible boolean;
begin
  select exists (
    select 1
    from public.teaching_assignments ta
    join public.lesson_requests lr on lr.programme_id = ta.programme_id
    where lr.id = p_lesson_request_id
      and ta.teacher_id = p_teacher_id
      and ta.status = 'active'
  ) into v_is_eligible;

  if not v_is_eligible then
    raise exception 'Teacher is not eligible for this enrolment';
  end if;

  update public.lesson_requests
  set status = 'matched', matched_teacher_id = p_teacher_id, matched_at = now()
  where id = p_lesson_request_id and status = 'open' and matched_teacher_id is null
  returning * into v_request;

  if v_request.id is null then
    raise exception 'This enrolment has already been taken';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (p_teacher_id, 'lesson_request.claimed', 'lesson_request', v_request.id,
    jsonb_build_object('teacher_id', p_teacher_id, 'programme_id', v_request.programme_id));

  return v_request;
end;
$$;

revoke all on function public.claim_open_lesson_request(uuid, uuid) from public, anon, authenticated;
grant execute on function public.claim_open_lesson_request(uuid, uuid) to service_role;
