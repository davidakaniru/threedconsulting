create type public.teacher_employment_status as enum ('active', 'on_leave', 'former');
create type public.teacher_onboarding_status as enum ('invited', 'active');

create table public.teachers (
  id uuid primary key references public.profiles(id) on delete cascade,
  employee_id text not null unique,
  qualification text,
  specialization text,
  hire_date date,
  employment_status public.teacher_employment_status not null default 'active',
  onboarding_status public.teacher_onboarding_status not null default 'invited',
  invited_at timestamptz not null default now(),
  activated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teachers_employee_id_length_check check (char_length(employee_id) between 2 and 40),
  constraint teachers_qualification_length_check check (qualification is null or char_length(qualification) <= 120),
  constraint teachers_specialization_length_check check (specialization is null or char_length(specialization) <= 120),
  constraint teachers_hire_date_check check (hire_date is null or hire_date <= current_date)
);

create index teachers_employment_status_idx on public.teachers (employment_status);
create index teachers_onboarding_status_idx on public.teachers (onboarding_status);
create index teachers_created_at_idx on public.teachers (created_at desc);

create trigger set_teachers_updated_at
before update on public.teachers
for each row execute function private.set_updated_at();

alter table public.teachers enable row level security;

grant select, insert, update on public.teachers to authenticated;

drop policy if exists "Admins can read teachers" on public.teachers;
create policy "Admins can read teachers"
on public.teachers for select to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'::public.user_role
      and p.status = 'active'::public.profile_status
  )
  or id = (select auth.uid())
);

drop policy if exists "Admins can insert teachers" on public.teachers;
create policy "Admins can insert teachers"
on public.teachers for insert to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'::public.user_role
      and p.status = 'active'::public.profile_status
  )
);

drop policy if exists "Admins can update teachers" on public.teachers;
create policy "Admins can update teachers"
on public.teachers for update to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'::public.user_role
      and p.status = 'active'::public.profile_status
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'::public.user_role
      and p.status = 'active'::public.profile_status
  )
);
