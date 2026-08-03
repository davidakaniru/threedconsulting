create type public.programme_status as enum ('draft','published','archived');
create table public.programmes (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null,
  description text, status public.programme_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint programmes_name_not_blank check (length(btrim(name)) > 0),
  constraint programmes_name_length_check check (char_length(name) <= 100),
  constraint programmes_slug_not_blank check (length(btrim(slug)) > 0),
  constraint programmes_slug_format_check check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint programmes_description_length_check check (description is null or char_length(description) <= 1000)
);
create unique index programmes_name_lower_unique_idx on public.programmes (lower(name));
create unique index programmes_slug_unique_idx on public.programmes (slug);
create index programmes_status_idx on public.programmes (status);
create index programmes_created_at_idx on public.programmes (created_at desc);
alter table public.programmes enable row level security;
revoke all on public.programmes from anon, authenticated;
grant all on public.programmes to service_role;
create trigger programmes_set_updated_at before update on public.programmes for each row execute function private.set_updated_at();
insert into public.programmes (name,slug,status) values
('English Language','english-language','published'),('Yoruba Language','yoruba-language','published'),
('Mathematics','mathematics','published'),('Chemistry','chemistry','published'),('Physics','physics','published'),
('Biology','biology','published'),('Coding','coding','published') on conflict do nothing;
