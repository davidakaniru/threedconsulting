create table public.lesson_reviews (
  id uuid primary key default gen_random_uuid(),
  lesson_assignment_id uuid not null unique references public.lesson_assignments(id) on delete cascade,
  parent_id uuid not null references public.parents(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  lesson_outcome text not null check (char_length(btrim(lesson_outcome)) between 10 and 2000),
  teacher_feedback text not null check (char_length(btrim(teacher_feedback)) between 10 and 2000),
  would_recommend boolean not null,
  additional_comments text check (additional_comments is null or char_length(btrim(additional_comments)) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lesson_reviews_parent_id_idx on public.lesson_reviews(parent_id);
create index lesson_reviews_rating_idx on public.lesson_reviews(rating);
create index lesson_reviews_created_at_idx on public.lesson_reviews(created_at desc);

alter table public.lesson_reviews enable row level security;

comment on table public.lesson_reviews is
  'Parent-submitted feedback for a matched lesson assignment. One review per lesson assignment; visible to the submitting parent and administrators through server-side application flows only.';
