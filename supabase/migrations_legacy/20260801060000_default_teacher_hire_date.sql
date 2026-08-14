update public.teachers
set hire_date = created_at::date
where hire_date is null;

alter table public.teachers
  alter column hire_date set default current_date,
  alter column hire_date set not null;
