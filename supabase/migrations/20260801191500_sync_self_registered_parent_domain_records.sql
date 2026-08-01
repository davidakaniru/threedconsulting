create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    avatar_url,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(btrim(new.raw_user_meta_data ->> 'first_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'last_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'avatar_url'), ''),
    'parent'::public.user_role,
    'active'::public.profile_status
  );

  insert into public.parents (
    id,
    onboarding_status,
    invited_at,
    activated_at
  )
  values (
    new.id,
    'active'::public.parent_onboarding_status,
    now(),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

insert into public.parents (
  id,
  onboarding_status,
  invited_at,
  activated_at
)
select
  p.id,
  'active'::public.parent_onboarding_status,
  p.created_at,
  coalesce(u.email_confirmed_at, p.created_at)
from public.profiles p
join auth.users u on u.id = p.id
left join public.parents pa on pa.id = p.id
where p.role = 'parent'::public.user_role
  and pa.id is null;
