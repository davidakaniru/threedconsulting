create type public.teaching_assignment_status as enum ('active','inactive');
create table public.teaching_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete restrict,
  programme_id uuid not null references public.programmes(id) on delete restrict,
  status public.teaching_assignment_status not null default 'active',
  primary_instructor boolean not null default true,
  assigned_by uuid references public.profiles(id) on delete set null,
  assigned_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teaching_assignments_teacher_programme_unique unique (teacher_id, programme_id)
);
create index teaching_assignments_programme_idx on public.teaching_assignments(programme_id, status);
create index teaching_assignments_teacher_idx on public.teaching_assignments(teacher_id, status);
alter table public.teaching_assignments enable row level security;
revoke all on public.teaching_assignments from anon, authenticated;
grant all on public.teaching_assignments to service_role;
create trigger teaching_assignments_set_updated_at before update on public.teaching_assignments for each row execute function private.set_updated_at();
