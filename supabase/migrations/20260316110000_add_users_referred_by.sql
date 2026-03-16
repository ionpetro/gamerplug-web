alter table public.users
add column if not exists referred_by text;

create or replace function public.mark_referral_converted()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $function$
declare
  user_email text;
  referral_referrer text;
begin
  select lower(email)
  into user_email
  from auth.users
  where id = new.id;

  if user_email is null then
    return new;
  end if;

  select referrer
  into referral_referrer
  from public.referrals
  where lower(email) = user_email
  limit 1;

  if referral_referrer is null then
    return new;
  end if;

  update public.users
  set referred_by = referral_referrer
  where id = new.id
    and referred_by is null;

  update public.referrals
  set converted = true
  where lower(email) = user_email
    and converted = false;

  return new;
end;
$function$;

update public.users u
set referred_by = r.referrer
from auth.users au
join public.referrals r
  on lower(r.email) = lower(au.email)
where au.id = u.id
  and u.referred_by is null;

update public.referrals r
set converted = true
from auth.users au
join public.users u
  on u.id = au.id
where lower(r.email) = lower(au.email)
  and converted = false;
