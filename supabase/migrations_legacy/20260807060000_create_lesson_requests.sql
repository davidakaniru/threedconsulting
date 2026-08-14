create type public.lesson_request_status as enum ('pending_review','open','matched','active','completed','cancelled');
create table public.lesson_requests (
  id uuid primary key default gen_random_uuid(), parent_id uuid not null references public.parents(id) on delete restrict,
  existing_student_id uuid references public.students(id) on delete restrict, programme_id uuid not null references public.programmes(id) on delete restrict,
  child_first_name text not null, child_last_name text not null, child_date_of_birth date not null,
  preferred_days text[] not null, preferred_time time not null, duration_months integer not null, additional_message text,
  status public.lesson_request_status not null default 'pending_review', reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz, published_at timestamptz, matched_teacher_id uuid references public.teachers(id) on delete restrict, matched_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint lesson_requests_child_first_name_not_blank check (length(btrim(child_first_name)) > 0),
  constraint lesson_requests_child_last_name_not_blank check (length(btrim(child_last_name)) > 0),
  constraint lesson_requests_child_dob_check check (child_date_of_birth <= current_date),
  constraint lesson_requests_preferred_days_not_empty check (cardinality(preferred_days) between 1 and 6),
  constraint lesson_requests_preferred_days_valid check (preferred_days <@ array['monday','tuesday','wednesday','thursday','friday','saturday']::text[]),
  constraint lesson_requests_duration_months_check check (duration_months between 1 and 24),
  constraint lesson_requests_additional_message_length check (additional_message is null or char_length(additional_message) <= 2000)
);
create index lesson_requests_parent_created_idx on public.lesson_requests(parent_id,created_at desc);
create index lesson_requests_status_created_idx on public.lesson_requests(status,created_at desc);
create index lesson_requests_programme_status_idx on public.lesson_requests(programme_id,status,created_at desc);
create index lesson_requests_teacher_match_idx on public.lesson_requests(matched_teacher_id) where matched_teacher_id is not null;
create trigger lesson_requests_set_updated_at before update on public.lesson_requests for each row execute function private.set_updated_at();
alter table public.lesson_requests enable row level security;
revoke all on public.lesson_requests from anon,authenticated;
grant all on public.lesson_requests to service_role;
comment on table public.lesson_requests is 'Parent tutoring requests reviewed by administrators and later exposed to eligible teachers for first-come matching.';
