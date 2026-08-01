alter table public.profiles
  add column phone text,
  add column date_of_birth date,
  add column address text,
  add column preferred_language text not null default 'en';

alter table public.profiles
  add constraint profiles_phone_length_check
    check (phone is null or char_length(phone) between 7 and 20),
  add constraint profiles_date_of_birth_check
    check (date_of_birth is null or date_of_birth <= current_date),
  add constraint profiles_address_length_check
    check (address is null or char_length(address) <= 250),
  add constraint profiles_preferred_language_check
    check (preferred_language in ('en'));

revoke update on public.profiles from authenticated;
grant update (first_name, last_name, avatar_url, phone, date_of_birth, address, preferred_language)
  on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read own avatar object" on storage.objects;
create policy "Users can read own avatar object"
on storage.objects for select to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can upload own avatar" on storage.objects;
create policy "Users can upload own avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create or replace function public.deactivate_own_profile(expected_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := (select auth.uid());
begin
  if caller_id is null then
    raise exception 'Authentication required';
  end if;

  if caller_id <> expected_user_id then
    raise exception 'Cannot deactivate another profile';
  end if;

  update public.profiles
  set status = 'inactive'::public.profile_status
  where id = caller_id and status = 'active'::public.profile_status;
end;
$$;

revoke all on function public.deactivate_own_profile(uuid) from public, anon;
grant execute on function public.deactivate_own_profile(uuid) to authenticated;
