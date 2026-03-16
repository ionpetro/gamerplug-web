update public.referrals r
set referrer_user_id = u.id
from public.users u
where r.referrer_user_id is null
  and lower(u.gamertag) = lower(r.referrer);

update public.users u
set referred_by_user_id = r.referrer_user_id
from auth.users au
join public.referrals r
  on lower(r.email) = lower(au.email)
where au.id = u.id
  and u.referred_by_user_id is null
  and r.referrer_user_id is not null;

create or replace function public.mark_referral_converted()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $function$
declare
  user_email text;
  referral_referrer text;
  referral_referrer_user_id uuid;
begin
  select lower(email)
  into user_email
  from auth.users
  where id = new.id;

  if user_email is null then
    return new;
  end if;

  select referrer, referrer_user_id
  into referral_referrer, referral_referrer_user_id
  from public.referrals
  where lower(email) = user_email
  limit 1;

  if referral_referrer_user_id is null and referral_referrer is not null then
    select id
    into referral_referrer_user_id
    from public.users
    where lower(gamertag) = lower(referral_referrer)
    limit 1;

    if referral_referrer_user_id is not null then
      update public.referrals
      set referrer_user_id = referral_referrer_user_id
      where lower(email) = user_email
        and referrer_user_id is null;
    end if;
  end if;

  if referral_referrer is null and referral_referrer_user_id is null then
    return new;
  end if;

  update public.users
  set referred_by = coalesce(referred_by, referral_referrer),
      referred_by_user_id = coalesce(referred_by_user_id, referral_referrer_user_id)
  where id = new.id;

  update public.referrals
  set converted = true
  where lower(email) = user_email
    and converted = false;

  return new;
end;
$function$;
