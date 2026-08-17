
create type public.tutor_application_status as enum (
  'pending',
  'reviewing',
  'accepted',
  'rejected'
);

create table public.tutor_applications (
  id uuid primary key default gen_random_uuid(),

  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,

  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  postcode text,
  country text not null,

  gender text not null check (gender in ('female', 'male', 'non_binary', 'prefer_not_to_say')),
  date_of_birth date not null,
  profile_image_path text not null,
  summary text not null,

  expertise text not null,
  qualifications text not null,
  cv_path text,

  status public.tutor_application_status not null default 'pending',
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  rejection_reason text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint tutor_applications_first_name_length check (char_length(trim(first_name)) between 2 and 80),
  constraint tutor_applications_last_name_length check (char_length(trim(last_name)) between 2 and 80),
  constraint tutor_applications_email_length check (char_length(trim(email)) between 5 and 254),
  constraint tutor_applications_phone_length check (char_length(trim(phone)) between 7 and 30),
  constraint tutor_applications_address1_length check (char_length(trim(address_line_1)) between 3 and 180),
  constraint tutor_applications_address2_length check (address_line_2 is null or char_length(trim(address_line_2)) <= 180),
  constraint tutor_applications_city_length check (char_length(trim(city)) between 2 and 100),
  constraint tutor_applications_postcode_length check (postcode is null or char_length(trim(postcode)) <= 30),
  constraint tutor_applications_country_length check (char_length(trim(country)) between 2 and 100),
  constraint tutor_applications_summary_length check (char_length(trim(summary)) between 30 and 1000),
  constraint tutor_applications_expertise_length check (char_length(trim(expertise)) between 2 and 1000),
  constraint tutor_applications_qualifications_length check (char_length(trim(qualifications)) between 2 and 1000)
);

create index tutor_applications_status_idx on public.tutor_applications(status);
create index tutor_applications_created_at_idx on public.tutor_applications(created_at desc);
create index tutor_applications_email_idx on public.tutor_applications(lower(email));

create trigger set_tutor_applications_updated_at
before update on public.tutor_applications
for each row execute function private.set_updated_at();

alter table public.tutor_applications enable row level security;

-- Applications are submitted through the server using the service-role client.
-- Applicants are not authenticated and must not be able to read or modify applications.
revoke all on public.tutor_applications from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tutor-applications',
  'tutor-applications',
  false,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
