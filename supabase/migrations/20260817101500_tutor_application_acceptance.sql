alter table public.teachers
  add column if not exists application_id uuid references public.tutor_applications(id) on delete set null,
  add column if not exists gender text,
  add column if not exists summary text,
  add column if not exists cv_path text;

create unique index if not exists teachers_application_id_unique
  on public.teachers(application_id)
  where application_id is not null;

alter table public.teachers
  drop constraint if exists teachers_gender_check;

alter table public.teachers
  add constraint teachers_gender_check
  check (gender is null or gender in ('male', 'female'));
