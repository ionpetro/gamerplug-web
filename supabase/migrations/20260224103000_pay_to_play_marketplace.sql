-- Pay-to-play marketplace schema (featured players + booking flow)

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'pay_to_play_service_type') then
    create type public.pay_to_play_service_type as enum ('duo_queue', 'coaching', 'carry', 'team_session');
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'pay_to_play_booking_status') then
    create type public.pay_to_play_booking_status as enum (
      'pending',
      'accepted',
      'declined',
      'cancelled_by_buyer',
      'cancelled_by_provider',
      'completed'
    );
  end if;
end$$;

create table if not exists public.pay_to_play_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  headline text,
  about text,
  timezone text not null default 'UTC',
  is_active boolean not null default false,
  is_featured boolean not null default false,
  featured_rank integer,
  average_rating numeric(3,2) not null default 0 check (average_rating >= 0 and average_rating <= 5),
  total_reviews integer not null default 0 check (total_reviews >= 0),
  total_completed_bookings integer not null default 0 check (total_completed_bookings >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pay_to_play_offers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  service_type public.pay_to_play_service_type not null,
  game_name text not null,
  platform text[],
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents integer not null check (price_cents >= 100),
  currency char(3) not null default 'USD',
  max_party_size integer not null default 1 check (max_party_size >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_offers_currency_ck check (currency ~ '^[A-Z]{3}$')
);

create table if not exists public.pay_to_play_availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.users(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  timezone text not null default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_availability_window_ck check (end_time > start_time)
);

create table if not exists public.pay_to_play_bookings (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.pay_to_play_offers(id) on delete restrict,
  provider_id uuid not null references public.users(id) on delete restrict,
  buyer_id uuid not null references public.users(id) on delete restrict,
  status public.pay_to_play_booking_status not null default 'pending',
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  buyer_message text,
  total_price_cents integer not null check (total_price_cents >= 0),
  currency char(3) not null default 'USD',
  accepted_at timestamptz,
  declined_at timestamptz,
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_bookings_currency_ck check (currency ~ '^[A-Z]{3}$'),
  constraint pay_to_play_bookings_window_ck check (scheduled_end > scheduled_start),
  constraint pay_to_play_bookings_distinct_users_ck check (buyer_id <> provider_id)
);

create table if not exists public.pay_to_play_reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.pay_to_play_bookings(id) on delete cascade,
  provider_id uuid not null references public.users(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_reviews_distinct_users_ck check (provider_id <> reviewer_id)
);

create index if not exists pay_to_play_profiles_featured_idx
  on public.pay_to_play_profiles (is_featured, featured_rank)
  where is_active = true;

create index if not exists pay_to_play_offers_provider_active_idx
  on public.pay_to_play_offers (provider_id, is_active, created_at desc);

create index if not exists pay_to_play_offers_game_active_idx
  on public.pay_to_play_offers (game_name, is_active);

create index if not exists pay_to_play_availability_provider_day_idx
  on public.pay_to_play_availability (provider_id, day_of_week)
  where is_active = true;

create index if not exists pay_to_play_bookings_provider_status_start_idx
  on public.pay_to_play_bookings (provider_id, status, scheduled_start desc);

create index if not exists pay_to_play_bookings_buyer_status_created_idx
  on public.pay_to_play_bookings (buyer_id, status, created_at desc);

create index if not exists pay_to_play_bookings_offer_start_idx
  on public.pay_to_play_bookings (offer_id, scheduled_start);

create index if not exists pay_to_play_reviews_provider_created_idx
  on public.pay_to_play_reviews (provider_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.pay_to_play_sync_booking_from_offer()
returns trigger
language plpgsql
as $$
declare
  offer_provider_id uuid;
  offer_price_cents integer;
  offer_currency char(3);
begin
  select provider_id, price_cents, currency
    into offer_provider_id, offer_price_cents, offer_currency
  from public.pay_to_play_offers
  where id = new.offer_id and is_active = true;

  if offer_provider_id is null then
    raise exception 'Offer does not exist or is not active';
  end if;

  new.provider_id = offer_provider_id;

  if new.buyer_id = offer_provider_id then
    raise exception 'Self-booking is not allowed';
  end if;

  if new.total_price_cents is null or new.total_price_cents = 0 then
    new.total_price_cents = offer_price_cents;
  end if;

  if new.currency is null then
    new.currency = offer_currency;
  end if;

  return new;
end;
$$;

create or replace function public.pay_to_play_set_status_timestamps()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then
    new.accepted_at = now();
  end if;

  if new.status = 'declined' and old.status is distinct from 'declined' then
    new.declined_at = now();
  end if;

  if new.status in ('cancelled_by_buyer', 'cancelled_by_provider')
     and old.status not in ('cancelled_by_buyer', 'cancelled_by_provider') then
    new.cancelled_at = now();
  end if;

  if new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists trg_pay_to_play_profiles_updated_at on public.pay_to_play_profiles;
create trigger trg_pay_to_play_profiles_updated_at
before update on public.pay_to_play_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_offers_updated_at on public.pay_to_play_offers;
create trigger trg_pay_to_play_offers_updated_at
before update on public.pay_to_play_offers
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_availability_updated_at on public.pay_to_play_availability;
create trigger trg_pay_to_play_availability_updated_at
before update on public.pay_to_play_availability
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_bookings_updated_at on public.pay_to_play_bookings;
create trigger trg_pay_to_play_bookings_updated_at
before update on public.pay_to_play_bookings
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_reviews_updated_at on public.pay_to_play_reviews;
create trigger trg_pay_to_play_reviews_updated_at
before update on public.pay_to_play_reviews
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_bookings_sync_offer on public.pay_to_play_bookings;
create trigger trg_pay_to_play_bookings_sync_offer
before insert or update of offer_id, buyer_id on public.pay_to_play_bookings
for each row execute function public.pay_to_play_sync_booking_from_offer();

drop trigger if exists trg_pay_to_play_bookings_status_timestamps on public.pay_to_play_bookings;
create trigger trg_pay_to_play_bookings_status_timestamps
before update of status on public.pay_to_play_bookings
for each row execute function public.pay_to_play_set_status_timestamps();

alter table public.pay_to_play_profiles enable row level security;
alter table public.pay_to_play_offers enable row level security;
alter table public.pay_to_play_availability enable row level security;
alter table public.pay_to_play_bookings enable row level security;
alter table public.pay_to_play_reviews enable row level security;

drop policy if exists "pay_to_play_profiles_read" on public.pay_to_play_profiles;
create policy "pay_to_play_profiles_read"
on public.pay_to_play_profiles for select
to authenticated
using (is_active = true or user_id = auth.uid());

drop policy if exists "pay_to_play_profiles_write_own" on public.pay_to_play_profiles;
create policy "pay_to_play_profiles_write_own"
on public.pay_to_play_profiles for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "pay_to_play_offers_read" on public.pay_to_play_offers;
create policy "pay_to_play_offers_read"
on public.pay_to_play_offers for select
to authenticated
using (is_active = true or provider_id = auth.uid());

drop policy if exists "pay_to_play_offers_write_own" on public.pay_to_play_offers;
create policy "pay_to_play_offers_write_own"
on public.pay_to_play_offers for all
to authenticated
using (provider_id = auth.uid())
with check (provider_id = auth.uid());

drop policy if exists "pay_to_play_availability_read" on public.pay_to_play_availability;
create policy "pay_to_play_availability_read"
on public.pay_to_play_availability for select
to authenticated
using (is_active = true or provider_id = auth.uid());

drop policy if exists "pay_to_play_availability_write_own" on public.pay_to_play_availability;
create policy "pay_to_play_availability_write_own"
on public.pay_to_play_availability for all
to authenticated
using (provider_id = auth.uid())
with check (provider_id = auth.uid());

drop policy if exists "pay_to_play_bookings_insert_buyer" on public.pay_to_play_bookings;
create policy "pay_to_play_bookings_insert_buyer"
on public.pay_to_play_bookings for insert
to authenticated
with check (buyer_id = auth.uid());

drop policy if exists "pay_to_play_bookings_select_provider_or_buyer" on public.pay_to_play_bookings;
create policy "pay_to_play_bookings_select_provider_or_buyer"
on public.pay_to_play_bookings for select
to authenticated
using (provider_id = auth.uid() or buyer_id = auth.uid());

drop policy if exists "pay_to_play_bookings_update_provider" on public.pay_to_play_bookings;
create policy "pay_to_play_bookings_update_provider"
on public.pay_to_play_bookings for update
to authenticated
using (provider_id = auth.uid())
with check (provider_id = auth.uid());

drop policy if exists "pay_to_play_bookings_update_buyer" on public.pay_to_play_bookings;
create policy "pay_to_play_bookings_update_buyer"
on public.pay_to_play_bookings for update
to authenticated
using (buyer_id = auth.uid())
with check (buyer_id = auth.uid());

drop policy if exists "pay_to_play_reviews_read" on public.pay_to_play_reviews;
create policy "pay_to_play_reviews_read"
on public.pay_to_play_reviews for select
to authenticated
using (true);

drop policy if exists "pay_to_play_reviews_insert_reviewer" on public.pay_to_play_reviews;
create policy "pay_to_play_reviews_insert_reviewer"
on public.pay_to_play_reviews for insert
to authenticated
with check (reviewer_id = auth.uid());

