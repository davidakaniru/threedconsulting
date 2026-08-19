create or replace function public.admin_assign_lesson_request(p_lesson_request_id uuid, p_teacher_id uuid, p_actor_id uuid) returns public.lesson_requests language plpgsql security definer set search_path = '' as $fn$
declare v_request public.lesson_requests%rowtype; v_programme_id uuid;
begin
 select * into v_request from public.lesson_requests where id=p_lesson_request_id for update;
 if not found then raise exception 'Enrolment not found'; end if;
 if v_request.status not in ('pending_review','open') or v_request.matched_teacher_id is not null then raise exception 'Enrolment is no longer available for assignment'; end if;
 select lrp.programme_id into v_programme_id from public.lesson_request_programmes lrp join public.teaching_assignments ta on ta.programme_id=lrp.programme_id and ta.teacher_id=p_teacher_id and ta.status='active' where lrp.lesson_request_id=p_lesson_request_id order by lrp.created_at asc limit 1;
 if v_programme_id is null and v_request.programme_id is not null then select ta.programme_id into v_programme_id from public.teaching_assignments ta where ta.teacher_id=p_teacher_id and ta.programme_id=v_request.programme_id and ta.status='active' limit 1; end if;
 if v_programme_id is null then raise exception 'Tutor is not eligible for any subject in this enrolment'; end if;
 update public.lesson_requests set status='matched',matched_teacher_id=p_teacher_id,matched_programme_id=v_programme_id,matched_at=now(),reviewed_by=coalesce(reviewed_by,p_actor_id),reviewed_at=coalesce(reviewed_at,now()),published_at=coalesce(published_at,now()) where id=p_lesson_request_id returning * into v_request;
 perform private.ensure_lesson_assignment_for_request(v_request.id);
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(p_actor_id,'lesson_request.assigned_by_admin','lesson_request',v_request.id,jsonb_build_object('teacher_id',p_teacher_id,'programme_id',v_programme_id));
 return v_request;
end;
$fn$;
revoke all on function public.admin_assign_lesson_request(uuid,uuid,uuid) from public;
grant execute on function public.admin_assign_lesson_request(uuid,uuid,uuid) to service_role;
