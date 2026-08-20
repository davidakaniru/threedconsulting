-- Reconstructed: original migration was applied directly on remote and the
-- local file was left as an empty placeholder. Rebuilt from the live schema
-- (public.students, public.student_status, private.student_admission_counters,
-- private.assign_student_admission_number, and the students trigger) so that
-- local migration replay matches what is actually deployed.

create type public.student_status as enum ('active', 'inactive', 'graduated', 'withdrawn');

create table public.students (
    id uuid primary key default gen_random_uuid(),
    admission_number text not null,
    first_name text not null,
    last_name text not null,
    date_of_birth date not null,
    gender text,
    photo_path text,
    status public.student_status not null default 'active',
    admission_date date not null default current_date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint students_admission_number_not_blank check (length(btrim(admission_number)) > 0),
    constraint students_date_of_birth_check check (date_of_birth <= current_date),
    constraint students_first_name_not_blank check (length(btrim(first_name)) > 0),
    constraint students_last_name_not_blank check (length(btrim(last_name)) > 0),
    constraint students_gender_check check (gender is null or gender = any (array['male','female','other','prefer_not_to_say']))
);

comment on table public.students is 'Non-authenticated learner records managed by administrators.';
comment on column public.students.photo_path is 'Private storage object path in the student-photos bucket.';

create unique index students_admission_number_lower_unique_idx on public.students (lower(admission_number));
create index students_created_at_idx on public.students (created_at desc);
create index students_status_idx on public.students (status);

alter table public.students enable row level security;

revoke all on public.students from anon, authenticated;
grant all on public.students to service_role;

-- Private admission-number counter table + trigger. The counter table and
-- initial function definition live here; 20260801160000 later replaces the
-- function body (CREATE OR REPLACE), which is a safe no-op-compatible update.

create table private.student_admission_counters (
    admission_year integer primary key,
    last_serial integer not null default 0,
    updated_at timestamptz not null default now(),
    constraint student_admission_counters_serial_check check (last_serial >= 0),
    constraint student_admission_counters_year_check check (admission_year between 2000 and 9999)
);

revoke all on private.student_admission_counters from public, anon, authenticated;

create or replace function private.assign_student_admission_number()
returns trigger language plpgsql security definer set search_path = '' as $$
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
$$;

revoke all on function private.assign_student_admission_number() from public;

create trigger students_assign_admission_number
    before insert on public.students
    for each row execute function private.assign_student_admission_number();

create trigger students_set_updated_at
    before update on public.students
    for each row execute function private.set_updated_at();

-- Private storage bucket for student photos (matches the live bucket config).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-photos', 'student-photos', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
