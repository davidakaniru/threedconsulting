alter table public.students
  add column if not exists current_education_level text;

with latest_level as (
  select distinct on (student_id)
    student_id,
    current_education_level
  from public.lesson_assignments
  where current_education_level is not null
    and btrim(current_education_level) <> ''
  order by student_id,
           case when status = 'active' then 0 else 1 end,
           created_at desc
)
update public.students s
set current_education_level = l.current_education_level
from latest_level l
where s.id = l.student_id
  and s.current_education_level is null;

alter table public.students
  add constraint students_current_education_level_length
  check (
    current_education_level is null
    or char_length(btrim(current_education_level)) between 1 and 100
  );

comment on column public.students.current_education_level is
  'Parent-managed current class or education level for the child.';
