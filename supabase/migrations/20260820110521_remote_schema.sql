drop extension if exists "pg_net";

create sequence "public"."teacher_employee_id_seq";

alter table "public"."teachers" drop constraint "teachers_address_line_1_length_check";

alter table "public"."teachers" drop constraint "teachers_city_length_check";

alter table "public"."teachers" drop constraint "teachers_country_length_check";

alter table "public"."teachers" drop constraint "teachers_expertise_length_check";

alter table "public"."teachers" drop constraint "teachers_qualifications_length_check";

alter table "public"."tutor_applications" drop constraint "tutor_applications_address2_length";

alter table "public"."tutor_applications" drop constraint "tutor_applications_postcode_length";

alter table "public"."teachers" drop constraint "teachers_qualification_length_check";

alter table "public"."teachers" drop constraint "teachers_specialization_length_check";


  create table "public"."lesson_request_programmes" (
    "lesson_request_id" uuid not null,
    "programme_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."lesson_request_programmes" enable row level security;


  create table "public"."organisation_settings" (
    "id" boolean not null default true,
    "organisation_name" text not null default 'Three-D Managers Limited'::text,
    "support_email" text,
    "support_phone" text,
    "timezone" text not null default 'Africa/Lagos'::text,
    "logo_path" text,
    "updated_by" uuid,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );


alter table "public"."organisation_settings" enable row level security;

alter table "public"."lesson_requests" add column "matched_programme_id" uuid;

alter table "public"."programmes" add column "cover_image_url" text not null default ''::text;

alter table "public"."programmes" add column "outcomes" jsonb not null default '[]'::jsonb;

alter table "public"."programmes" add column "overview" text not null default ''::text;

alter table "public"."programmes" add column "title" text not null;

alter table "public"."teachers" drop column "address_line_1";

alter table "public"."teachers" drop column "city";

alter table "public"."teachers" drop column "country";

alter table "public"."teachers" drop column "expertise";

alter table "public"."teachers" drop column "qualifications";

alter table "public"."teachers" alter column "employee_id" set default private.next_teacher_employee_id();

alter table "public"."tutor_applications" drop column "address_line_2";

alter table "public"."tutor_applications" drop column "postcode";

CREATE INDEX audit_logs_actor_created_idx ON public.audit_logs USING btree (actor_id, created_at DESC);

CREATE INDEX audit_logs_entity_idx ON public.audit_logs USING btree (entity_type, entity_id);

CREATE INDEX cohort_students_cohort_status_idx ON public.cohort_students USING btree (cohort_id, status);

CREATE INDEX cohort_students_student_idx ON public.cohort_students USING btree (student_id);

CREATE INDEX cohorts_assignment_status_idx ON public.cohorts USING btree (teaching_assignment_id, status);

CREATE INDEX cohorts_start_date_idx ON public.cohorts USING btree (start_date DESC);

CREATE INDEX enrolment_application_programmes_programme_idx ON public.enrolment_application_programmes USING btree (programme_id);

CREATE INDEX enrolment_applications_parent_idx ON public.enrolment_applications USING btree (parent_id, submitted_at DESC);

CREATE UNIQUE INDEX lesson_request_programmes_pkey ON public.lesson_request_programmes USING btree (lesson_request_id, programme_id);

CREATE INDEX lesson_request_programmes_programme_idx ON public.lesson_request_programmes USING btree (programme_id);

CREATE UNIQUE INDEX organisation_settings_pkey ON public.organisation_settings USING btree (id);

CREATE INDEX programme_enrolments_programme_status_idx ON public.programme_enrolments USING btree (programme_id, status);

CREATE UNIQUE INDEX programmes_title_unique ON public.programmes USING btree (lower(title));

alter table "public"."lesson_request_programmes" add constraint "lesson_request_programmes_pkey" PRIMARY KEY using index "lesson_request_programmes_pkey";

alter table "public"."organisation_settings" add constraint "organisation_settings_pkey" PRIMARY KEY using index "organisation_settings_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_action_not_blank" CHECK ((length(btrim(action)) > 0)) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_action_not_blank";

alter table "public"."audit_logs" add constraint "audit_logs_entity_type_not_blank" CHECK ((length(btrim(entity_type)) > 0)) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_entity_type_not_blank";

alter table "public"."cohort_students" add constraint "cohort_students_dates_check" CHECK (((left_at IS NULL) OR (left_at >= joined_at))) not valid;

alter table "public"."cohort_students" validate constraint "cohort_students_dates_check";

alter table "public"."cohorts" add constraint "cohorts_description_length_check" CHECK (((description IS NULL) OR (char_length(description) <= 1000))) not valid;

alter table "public"."cohorts" validate constraint "cohorts_description_length_check";

alter table "public"."enrolment_applications" add constraint "enrolment_additional_information_length" CHECK (((additional_information IS NULL) OR (char_length(additional_information) <= 1000))) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_additional_information_length";

alter table "public"."enrolment_applications" add constraint "enrolment_child_first_name_not_blank" CHECK ((length(btrim(child_first_name)) > 0)) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_child_first_name_not_blank";

alter table "public"."enrolment_applications" add constraint "enrolment_child_last_name_not_blank" CHECK ((length(btrim(child_last_name)) > 0)) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_child_last_name_not_blank";

alter table "public"."enrolment_applications" add constraint "enrolment_email_not_blank" CHECK ((length(btrim(email)) > 0)) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_email_not_blank";

alter table "public"."enrolment_applications" add constraint "enrolment_parent_name_not_blank" CHECK ((length(btrim(parent_name)) > 0)) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_parent_name_not_blank";

alter table "public"."enrolment_applications" add constraint "enrolment_phone_not_blank" CHECK ((length(btrim(phone)) > 0)) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_phone_not_blank";

alter table "public"."enrolment_applications" add constraint "enrolment_review_notes_length" CHECK (((review_notes IS NULL) OR (char_length(review_notes) <= 1000))) not valid;

alter table "public"."enrolment_applications" validate constraint "enrolment_review_notes_length";

alter table "public"."lesson_request_programmes" add constraint "lesson_request_programmes_lesson_request_id_fkey" FOREIGN KEY (lesson_request_id) REFERENCES public.lesson_requests(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_request_programmes" validate constraint "lesson_request_programmes_lesson_request_id_fkey";

alter table "public"."lesson_request_programmes" add constraint "lesson_request_programmes_programme_id_fkey" FOREIGN KEY (programme_id) REFERENCES public.programmes(id) ON DELETE RESTRICT not valid;

alter table "public"."lesson_request_programmes" validate constraint "lesson_request_programmes_programme_id_fkey";

alter table "public"."lesson_requests" add constraint "lesson_requests_matched_programme_id_fkey" FOREIGN KEY (matched_programme_id) REFERENCES public.programmes(id) ON DELETE SET NULL not valid;

alter table "public"."lesson_requests" validate constraint "lesson_requests_matched_programme_id_fkey";

alter table "public"."organisation_settings" add constraint "organisation_name_length" CHECK ((char_length(organisation_name) <= 160)) not valid;

alter table "public"."organisation_settings" validate constraint "organisation_name_length";

alter table "public"."organisation_settings" add constraint "organisation_name_not_blank" CHECK ((length(btrim(organisation_name)) > 0)) not valid;

alter table "public"."organisation_settings" validate constraint "organisation_name_not_blank";

alter table "public"."organisation_settings" add constraint "organisation_settings_singleton" CHECK ((id = true)) not valid;

alter table "public"."organisation_settings" validate constraint "organisation_settings_singleton";

alter table "public"."organisation_settings" add constraint "organisation_settings_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL not valid;

alter table "public"."organisation_settings" validate constraint "organisation_settings_updated_by_fkey";

alter table "public"."organisation_settings" add constraint "support_email_length" CHECK (((support_email IS NULL) OR (char_length(support_email) <= 254))) not valid;

alter table "public"."organisation_settings" validate constraint "support_email_length";

alter table "public"."organisation_settings" add constraint "support_phone_length" CHECK (((support_phone IS NULL) OR (char_length(support_phone) <= 40))) not valid;

alter table "public"."organisation_settings" validate constraint "support_phone_length";

alter table "public"."organisation_settings" add constraint "timezone_not_blank" CHECK ((length(btrim(timezone)) > 0)) not valid;

alter table "public"."organisation_settings" validate constraint "timezone_not_blank";

alter table "public"."programmes" add constraint "programmes_outcomes_array_check" CHECK ((jsonb_typeof(outcomes) = 'array'::text)) not valid;

alter table "public"."programmes" validate constraint "programmes_outcomes_array_check";

alter table "public"."students" add constraint "students_middle_name_length_check" CHECK (((middle_name IS NULL) OR (char_length(middle_name) <= 50))) not valid;

alter table "public"."students" validate constraint "students_middle_name_length_check";

alter table "public"."students" add constraint "students_notes_length_check" CHECK (((notes IS NULL) OR (char_length(notes) <= 1000))) not valid;

alter table "public"."students" validate constraint "students_notes_length_check";

alter table "public"."teachers" add constraint "teachers_qualification_length_check" CHECK (((qualification IS NULL) OR (char_length(qualification) <= 1000))) not valid;

alter table "public"."teachers" validate constraint "teachers_qualification_length_check";

alter table "public"."teachers" add constraint "teachers_specialization_length_check" CHECK (((specialization IS NULL) OR (char_length(specialization) <= 1000))) not valid;

alter table "public"."teachers" validate constraint "teachers_specialization_length_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.next_teacher_employee_id()
 RETURNS text
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
  select 'TCH-' || lpad(nextval('public.teacher_employee_id_seq')::text, 4, '0');
$function$
;

CREATE OR REPLACE FUNCTION private.assign_cohort_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_slug text;
  v_prefix text;
  v_next_serial integer;
begin
  if new.code is not null and btrim(new.code) <> '' then
    return new;
  end if;

  select p.slug into v_slug
  from public.teaching_assignments ta
  join public.programmes p on p.id = ta.programme_id
  where ta.id = new.teaching_assignment_id;

  if v_slug is null then
    raise exception 'Teaching assignment programme not found';
  end if;

  v_prefix := upper(substr(regexp_replace(v_slug, '[^a-zA-Z0-9]', '', 'g'), 1, 3));
  if char_length(v_prefix) < 3 then
    v_prefix := rpad(v_prefix, 3, 'X');
  end if;

  insert into private.cohort_code_counters as counters(prefix,last_serial,updated_at)
  values(v_prefix,1,now())
  on conflict(prefix) do update set
    last_serial = counters.last_serial + 1,
    updated_at = now()
  returning last_serial into v_next_serial;

  new.code := format('%s-%s', v_prefix, lpad(v_next_serial::text, 3, '0'));
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.assign_student_admission_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_admission_year integer;
  v_next_serial integer;
begin
  if new.admission_date is null then
    new.admission_date := current_date;
  end if;

  v_admission_year := extract(year from new.admission_date)::integer;

  if new.admission_number is null or btrim(new.admission_number) = '' then
    insert into private.student_admission_counters as counters (
      admission_year,
      last_serial,
      updated_at
    )
    values (
      v_admission_year,
      1,
      now()
    )
    on conflict (admission_year)
    do update set
      last_serial = counters.last_serial + 1,
      updated_at = now()
    returning last_serial into v_next_serial;

    new.admission_number := format(
      'STD-%s-%s',
      v_admission_year,
      lpad(v_next_serial::text, 4, '0')
    );
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.ensure_lesson_assignment_for_request(p_request_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_request public.lesson_requests%rowtype; v_student_id uuid; v_assignment_id uuid; v_has_primary boolean; v_programme_id uuid;
begin
 select * into v_request from public.lesson_requests where id=p_request_id for update;
 if not found then raise exception 'Enrolment not found'; end if;
 if v_request.matched_teacher_id is null then raise exception 'Enrolment has not been matched to a teacher'; end if;
 select id into v_assignment_id from public.lesson_assignments where lesson_request_id=v_request.id;
 if v_assignment_id is not null then return v_assignment_id; end if;
 v_programme_id := coalesce(v_request.matched_programme_id, v_request.programme_id);
 if not exists (select 1 from public.teaching_assignments ta where ta.teacher_id=v_request.matched_teacher_id and ta.programme_id=v_programme_id and ta.status='active') then raise exception 'Matched teacher is not eligible for the selected subject'; end if;
 v_student_id := v_request.existing_student_id;
 if v_student_id is null then
   select s.id into v_student_id from public.students s join public.student_parents sp on sp.student_id=s.id where sp.parent_id=v_request.parent_id and lower(btrim(s.first_name))=lower(btrim(v_request.child_first_name)) and lower(btrim(s.last_name))=lower(btrim(v_request.child_last_name)) and s.date_of_birth=v_request.child_date_of_birth order by sp.is_primary_contact desc,s.created_at asc limit 1;
 end if;
 if v_student_id is null then
   insert into public.students(admission_number,first_name,last_name,date_of_birth,admission_date,status) values ('',btrim(v_request.child_first_name),btrim(v_request.child_last_name),v_request.child_date_of_birth,current_date,'active'::public.student_status) returning id into v_student_id;
 end if;
 select exists(select 1 from public.student_parents where student_id=v_student_id and is_primary_contact=true) into v_has_primary;
 insert into public.student_parents(student_id,parent_id,relationship,is_primary_contact) values(v_student_id,v_request.parent_id,'guardian'::public.guardian_relationship,not v_has_primary) on conflict(student_id,parent_id) do nothing;
 update public.lesson_requests set existing_student_id=v_student_id where id=v_request.id and existing_student_id is null;
 insert into public.lesson_assignments(lesson_request_id,teacher_id,student_id,parent_id,programme_id,current_education_level,preferred_days,session_time,duration_months,start_date,end_date,status)
 values(v_request.id,v_request.matched_teacher_id,v_student_id,v_request.parent_id,v_programme_id,v_request.current_education_level,v_request.preferred_days,v_request.preferred_time,v_request.duration_months,coalesce(v_request.matched_at::date,current_date),(coalesce(v_request.matched_at::date,current_date)+make_interval(months=>v_request.duration_months))::date,'active'::public.lesson_assignment_status) returning id into v_assignment_id;
 return v_assignment_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.handle_auth_user_email_updated()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if new.email is distinct from old.email then
    update public.profiles
    set email = coalesce(new.email, '')
    where id = new.id;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION private.populate_homework_submissions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_session public.class_sessions%rowtype;
begin
  if new.status = 'published'::public.homework_status
     and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    select * into v_session
    from public.class_sessions
    where id = new.session_id;

    if v_session.lesson_assignment_id is not null then
      insert into public.homework_submissions (homework_id, student_id, status)
      select new.id, la.student_id, 'pending'::public.homework_submission_status
      from public.lesson_assignments la
      where la.id = v_session.lesson_assignment_id
      on conflict (homework_id, student_id) do nothing;
    elsif v_session.cohort_id is not null then
      insert into public.homework_submissions (homework_id, student_id, status)
      select new.id, cs.student_id, 'pending'::public.homework_submission_status
      from public.cohort_students cs
      where cs.cohort_id = v_session.cohort_id
        and cs.status = 'active'::public.cohort_membership_status
      on conflict (homework_id, student_id) do nothing;
    end if;
  end if;
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.admin_assign_lesson_request(p_lesson_request_id uuid, p_teacher_id uuid, p_actor_id uuid)
 RETURNS public.lesson_requests
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_request public.lesson_requests%rowtype; v_programme_id uuid; v_assignment_id uuid;
begin
 select * into v_request from public.lesson_requests where id=p_lesson_request_id for update;
 if not found then raise exception 'Enrolment not found'; end if;
 if v_request.status not in ('pending_review','open') or v_request.matched_teacher_id is not null then raise exception 'Enrolment is no longer available for assignment'; end if;
 select lrp.programme_id into v_programme_id
 from public.lesson_request_programmes lrp
 join public.teaching_assignments ta on ta.programme_id=lrp.programme_id and ta.teacher_id=p_teacher_id and ta.status='active'
 where lrp.lesson_request_id=p_lesson_request_id
 order by lrp.created_at asc limit 1;
 if v_programme_id is null and v_request.programme_id is not null then
   select ta.programme_id into v_programme_id from public.teaching_assignments ta where ta.teacher_id=p_teacher_id and ta.programme_id=v_request.programme_id and ta.status='active' limit 1;
 end if;
 if v_programme_id is null then raise exception 'Tutor is not eligible for any subject in this enrolment'; end if;
 update public.lesson_requests set status='matched',matched_teacher_id=p_teacher_id,matched_programme_id=v_programme_id,matched_at=now(),reviewed_by=coalesce(reviewed_by,p_actor_id),reviewed_at=coalesce(reviewed_at,now()),published_at=coalesce(published_at,now()) where id=p_lesson_request_id returning * into v_request;
 perform private.ensure_lesson_assignment_for_request(v_request.id);
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(p_actor_id,'lesson_request.assigned_by_admin','lesson_request',v_request.id,jsonb_build_object('teacher_id',p_teacher_id,'programme_id',v_programme_id));
 return v_request;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.approve_enrolment_application(p_application_id uuid, p_assignments jsonb, p_reviewer_id uuid, p_review_notes text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_application public.enrolment_applications%rowtype;
  v_student_id uuid;
  v_assignment jsonb;
  v_programme_id uuid;
  v_cohort_id uuid;
  v_requested_count integer;
  v_assignment_count integer;
  v_capacity integer;
  v_member_count integer;
  v_cohort_programme_id uuid;
begin
  select * into v_application
  from public.enrolment_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Enrolment application not found';
  end if;

  if v_application.status not in ('pending'::public.enrolment_application_status, 'under_review'::public.enrolment_application_status) then
    raise exception 'Only pending or under-review applications can be approved';
  end if;

  if jsonb_typeof(p_assignments) <> 'array' then
    raise exception 'Cohort assignments must be an array';
  end if;

  select count(*) into v_requested_count
  from public.enrolment_application_programmes
  where application_id = p_application_id;

  select count(*) into v_assignment_count
  from jsonb_array_elements(p_assignments);

  if v_requested_count = 0 or v_assignment_count <> v_requested_count then
    raise exception 'Every requested programme must have exactly one cohort assignment';
  end if;

  v_student_id := v_application.existing_student_id;

  if v_student_id is null then
    insert into public.students (
      admission_number,
      first_name,
      last_name,
      date_of_birth,
      admission_date,
      status,
      notes
    ) values (
      '',
      btrim(v_application.child_first_name),
      btrim(v_application.child_last_name),
      v_application.child_date_of_birth,
      current_date,
      'active'::public.student_status,
      nullif(btrim(v_application.additional_information), '')
    ) returning id into v_student_id;

    insert into public.student_parents (
      student_id,
      parent_id,
      relationship,
      is_primary_contact
    ) values (
      v_student_id,
      v_application.parent_id,
      'guardian'::public.guardian_relationship,
      true
    ) on conflict (student_id, parent_id) do nothing;
  end if;

  for v_assignment in select value from jsonb_array_elements(p_assignments)
  loop
    v_programme_id := (v_assignment ->> 'programmeId')::uuid;
    v_cohort_id := (v_assignment ->> 'cohortId')::uuid;

    if not exists (
      select 1 from public.enrolment_application_programmes
      where application_id = p_application_id and programme_id = v_programme_id
    ) then
      raise exception 'A cohort was supplied for a programme that was not requested';
    end if;

    select c.capacity, ta.programme_id
      into v_capacity, v_cohort_programme_id
    from public.cohorts c
    join public.teaching_assignments ta on ta.id = c.teaching_assignment_id
    where c.id = v_cohort_id
      and c.status in ('open'::public.cohort_status, 'active'::public.cohort_status)
      and ta.status = 'active'::public.teaching_assignment_status;

    if not found or v_cohort_programme_id <> v_programme_id then
      raise exception 'Selected cohort is not available for the requested programme';
    end if;

    select count(*) into v_member_count
    from public.cohort_students
    where cohort_id = v_cohort_id and status = 'active'::public.cohort_membership_status;

    if v_member_count >= v_capacity then
      raise exception 'Selected cohort is full';
    end if;

    insert into public.programme_enrolments (
      student_id,
      programme_id,
      application_id,
      status,
      created_by
    ) values (
      v_student_id,
      v_programme_id,
      p_application_id,
      'active'::public.programme_enrolment_status,
      p_reviewer_id
    ) on conflict (student_id, programme_id) where status = 'active' do nothing;

    insert into public.cohort_students (
      cohort_id,
      student_id,
      status,
      assigned_by
    ) values (
      v_cohort_id,
      v_student_id,
      'active'::public.cohort_membership_status,
      p_reviewer_id
    ) on conflict (cohort_id, student_id) do update set
      status = 'active'::public.cohort_membership_status,
      left_at = null,
      assigned_by = excluded.assigned_by,
      updated_at = now();
  end loop;

  update public.enrolment_applications
  set status = 'approved'::public.enrolment_application_status,
      reviewed_by = p_reviewer_id,
      reviewed_at = now(),
      review_notes = nullif(btrim(p_review_notes), ''),
      approved_student_id = v_student_id
  where id = p_application_id;

  return v_student_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.claim_open_lesson_request(p_lesson_request_id uuid, p_teacher_id uuid)
 RETURNS public.lesson_requests
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_request public.lesson_requests%rowtype; v_programme_id uuid;
begin
 select lrp.programme_id into v_programme_id from public.lesson_request_programmes lrp join public.teaching_assignments ta on ta.programme_id=lrp.programme_id and ta.teacher_id=p_teacher_id and ta.status='active' where lrp.lesson_request_id=p_lesson_request_id order by lrp.created_at asc limit 1;
 if v_programme_id is null then raise exception 'Teacher is not eligible for this enrolment'; end if;
 update public.lesson_requests set status='matched',matched_teacher_id=p_teacher_id,matched_programme_id=v_programme_id,matched_at=now() where id=p_lesson_request_id and status='open' and matched_teacher_id is null returning * into v_request;
 if v_request.id is null then raise exception 'This enrolment has already been taken'; end if;
 perform private.ensure_lesson_assignment_for_request(v_request.id);
 insert into public.audit_logs(actor_id,action,entity_type,entity_id,metadata) values(p_teacher_id,'lesson_request.claimed','lesson_request',v_request.id,jsonb_build_object('teacher_id',p_teacher_id,'programme_id',v_programme_id));
 return v_request;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.finalize_expired_class_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$ declare v_count integer := 0; begin update public.class_sessions cs set status = case when exists (select 1 from public.session_joins j where j.session_id = cs.id and j.participant_type='teacher' and j.joined_at <= (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos') and exists (select 1 from public.session_joins j where j.session_id = cs.id and j.participant_type='student' and j.joined_at <= (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos') then 'completed'::public.class_session_status else 'cancelled'::public.class_session_status end, updated_at=now() where cs.status='scheduled'::public.class_session_status and (cs.session_date::text || ' ' || cs.end_time::text)::timestamp at time zone 'Africa/Lagos' <= now(); get diagnostics v_count = row_count; insert into public.session_attendance(session_id,student_id,status,marked_by,marked_at) select cs.id,la.student_id,'absent'::public.attendance_status,null,now() from public.class_sessions cs join public.lesson_assignments la on la.id=cs.lesson_assignment_id where cs.status='cancelled'::public.class_session_status and not exists (select 1 from public.session_attendance sa where sa.session_id=cs.id and sa.student_id=la.student_id) on conflict (session_id,student_id) do nothing; return v_count; end; $function$
;

CREATE OR REPLACE FUNCTION public.record_session_join(p_session_id uuid, p_participant_type text, p_joined_at timestamp with time zone DEFAULT now())
 RETURNS public.class_sessions
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$ declare v_session public.class_sessions%rowtype; v_start timestamptz; v_end timestamptz; v_student_id uuid; v_teacher_joined boolean; v_student_joined boolean; begin if p_participant_type not in ('teacher','student') then raise exception 'Invalid participant type'; end if; select * into v_session from public.class_sessions where id = p_session_id for update; if not found then raise exception 'Session not found'; end if; if v_session.status <> 'scheduled'::public.class_session_status then raise exception 'Session is not currently scheduled'; end if; v_start := (v_session.session_date::text || ' ' || v_session.start_time::text)::timestamp at time zone 'Africa/Lagos'; v_end := (v_session.session_date::text || ' ' || v_session.end_time::text)::timestamp at time zone 'Africa/Lagos'; if p_joined_at < v_start - interval '5 minutes' or p_joined_at > v_end then raise exception 'Session join window is closed'; end if; insert into public.session_joins(session_id, participant_type, joined_at) values (p_session_id, p_participant_type, p_joined_at) on conflict (session_id, participant_type) do nothing; if p_participant_type = 'student' and v_session.lesson_assignment_id is not null then select student_id into v_student_id from public.lesson_assignments where id = v_session.lesson_assignment_id; insert into public.session_attendance(session_id, student_id, status, marked_by, marked_at) values (p_session_id, v_student_id, 'present'::public.attendance_status, null, p_joined_at) on conflict (session_id, student_id) do update set status = 'present'::public.attendance_status, marked_by = null, marked_at = p_joined_at, updated_at = now(); end if; select exists(select 1 from public.session_joins where session_id=p_session_id and participant_type='teacher' and joined_at <= v_end) into v_teacher_joined; select exists(select 1 from public.session_joins where session_id=p_session_id and participant_type='student' and joined_at <= v_end) into v_student_joined; if v_teacher_joined and v_student_joined and p_joined_at >= v_start then update public.class_sessions set status='completed'::public.class_session_status, updated_at=now() where id=p_session_id; select * into v_session from public.class_sessions where id=p_session_id; end if; return v_session; end; $function$
;

grant delete on table "public"."contact_inquiries" to "anon";

grant insert on table "public"."contact_inquiries" to "anon";

grant select on table "public"."contact_inquiries" to "anon";

grant update on table "public"."contact_inquiries" to "anon";

grant delete on table "public"."contact_inquiries" to "authenticated";

grant insert on table "public"."contact_inquiries" to "authenticated";

grant select on table "public"."contact_inquiries" to "authenticated";

grant update on table "public"."contact_inquiries" to "authenticated";

grant delete on table "public"."contact_inquiries" to "service_role";

grant insert on table "public"."contact_inquiries" to "service_role";

grant select on table "public"."contact_inquiries" to "service_role";

grant update on table "public"."contact_inquiries" to "service_role";

grant delete on table "public"."lesson_request_programmes" to "service_role";

grant insert on table "public"."lesson_request_programmes" to "service_role";

grant references on table "public"."lesson_request_programmes" to "service_role";

grant select on table "public"."lesson_request_programmes" to "service_role";

grant trigger on table "public"."lesson_request_programmes" to "service_role";

grant truncate on table "public"."lesson_request_programmes" to "service_role";

grant update on table "public"."lesson_request_programmes" to "service_role";

grant delete on table "public"."lesson_reviews" to "anon";

grant insert on table "public"."lesson_reviews" to "anon";

grant select on table "public"."lesson_reviews" to "anon";

grant update on table "public"."lesson_reviews" to "anon";

grant delete on table "public"."lesson_reviews" to "authenticated";

grant insert on table "public"."lesson_reviews" to "authenticated";

grant select on table "public"."lesson_reviews" to "authenticated";

grant update on table "public"."lesson_reviews" to "authenticated";

grant delete on table "public"."lesson_reviews" to "service_role";

grant insert on table "public"."lesson_reviews" to "service_role";

grant select on table "public"."lesson_reviews" to "service_role";

grant update on table "public"."lesson_reviews" to "service_role";

grant delete on table "public"."organisation_settings" to "service_role";

grant insert on table "public"."organisation_settings" to "service_role";

grant references on table "public"."organisation_settings" to "service_role";

grant select on table "public"."organisation_settings" to "service_role";

grant trigger on table "public"."organisation_settings" to "service_role";

grant truncate on table "public"."organisation_settings" to "service_role";

grant update on table "public"."organisation_settings" to "service_role";

grant delete on table "public"."teachers" to "anon";

grant insert on table "public"."teachers" to "anon";

grant select on table "public"."teachers" to "anon";

grant update on table "public"."teachers" to "anon";

grant delete on table "public"."teachers" to "authenticated";

grant delete on table "public"."teachers" to "service_role";

grant insert on table "public"."teachers" to "service_role";

grant select on table "public"."teachers" to "service_role";

grant update on table "public"."teachers" to "service_role";

grant delete on table "public"."tutor_applications" to "service_role";

grant insert on table "public"."tutor_applications" to "service_role";

grant select on table "public"."tutor_applications" to "service_role";

grant update on table "public"."tutor_applications" to "service_role";

CREATE TRIGGER organisation_settings_set_updated_at BEFORE UPDATE ON public.organisation_settings FOR EACH ROW EXECUTE FUNCTION private.set_updated_at();


