create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  phone text,
  subject text not null check (char_length(btrim(subject)) between 2 and 160),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  status text not null default 'unread' check (status in ('unread','read','archived')),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);
create index contact_inquiries_status_created_at_idx
  on public.contact_inquiries (status, created_at desc);

alter table public.contact_inquiries enable row level security;

comment on table public.contact_inquiries is
  'Messages submitted through the public website contact form. Server-side service-role access only.';
comment on column public.contact_inquiries.status is
  'Admin inbox state: unread, read, or archived.';
