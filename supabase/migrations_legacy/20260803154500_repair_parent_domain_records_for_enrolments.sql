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
  and pa.id is null
on conflict (id) do nothing;

create or replace function public.ensure_parent_record(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.profiles%rowtype;
begin
  select * into v_profile
  from public.profiles
  where id = p_user_id;

  if not found then
    raise exception 'Profile not found';
  end if;

  if v_profile.role <> 'parent'::public.user_role then
    raise exception 'Only parent profiles can create parent records';
  end if;

  insert into public.parents (
    id,
    onboarding_status,
    invited_at,
    activated_at
  )
  values (
    p_user_id,
    'active'::public.parent_onboarding_status,
    v_profile.created_at,
    now()
  )
  on conflict (id) do nothing;

  return p_user_id;
end;
$$;

revoke all on function public.ensure_parent_record(uuid) from public, anon, authenticated;
grant execute on function public.ensure_parent_record(uuid) to service_role;
