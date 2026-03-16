alter table public.referrals
add column if not exists referrer_user_id uuid;

alter table public.users
add column if not exists referred_by_user_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'referrals_referrer_user_id_fkey'
  ) then
    alter table public.referrals
    add constraint referrals_referrer_user_id_fkey
    foreign key (referrer_user_id) references public.users(id) on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_referred_by_user_id_fkey'
  ) then
    alter table public.users
    add constraint users_referred_by_user_id_fkey
    foreign key (referred_by_user_id) references public.users(id) on delete set null;
  end if;
end $$;

create index if not exists referrals_referrer_user_id_idx
on public.referrals (referrer_user_id);

create index if not exists users_referred_by_user_id_idx
on public.users (referred_by_user_id);

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
