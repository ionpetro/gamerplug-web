-- Upgrade pay-to-play to Airbnb-style listing model

alter table public.pay_to_play_offers
  add column if not exists instant_book boolean not null default false,
  add column if not exists booking_notice_hours integer not null default 24 check (booking_notice_hours >= 0),
  add column if not exists cancellation_policy text not null default 'moderate',
  add column if not exists location_type text not null default 'online';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pay_to_play_offers_location_type_ck'
  ) then
    alter table public.pay_to_play_offers
      add constraint pay_to_play_offers_location_type_ck
      check (location_type in ('online', 'discord', 'in_game_party', 'custom'));
  end if;
end$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'pay_to_play_offers_cancellation_policy_ck'
  ) then
    alter table public.pay_to_play_offers
      add constraint pay_to_play_offers_cancellation_policy_ck
      check (cancellation_policy in ('flexible', 'moderate', 'strict'));
  end if;
end$$;

create table if not exists public.pay_to_play_listing_media (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.pay_to_play_offers(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image',
  sort_order integer not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_listing_media_type_ck check (media_type in ('image', 'video'))
);

create unique index if not exists pay_to_play_listing_media_single_cover_idx
  on public.pay_to_play_listing_media (offer_id)
  where is_cover = true;

create index if not exists pay_to_play_listing_media_offer_sort_idx
  on public.pay_to_play_listing_media (offer_id, sort_order asc, created_at asc);

create table if not exists public.pay_to_play_availability_slots (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.users(id) on delete cascade,
  offer_id uuid references public.pay_to_play_offers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'UTC',
  is_booked boolean not null default false,
  booking_id uuid references public.pay_to_play_bookings(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pay_to_play_availability_slots_window_ck check (ends_at > starts_at)
);

create unique index if not exists pay_to_play_availability_slots_booking_id_uq
  on public.pay_to_play_availability_slots (booking_id)
  where booking_id is not null;

create index if not exists pay_to_play_availability_slots_provider_time_idx
  on public.pay_to_play_availability_slots (provider_id, starts_at asc)
  where is_booked = false;

create index if not exists pay_to_play_availability_slots_offer_time_idx
  on public.pay_to_play_availability_slots (offer_id, starts_at asc);

drop trigger if exists trg_pay_to_play_listing_media_updated_at on public.pay_to_play_listing_media;
create trigger trg_pay_to_play_listing_media_updated_at
before update on public.pay_to_play_listing_media
for each row execute function public.set_updated_at();

drop trigger if exists trg_pay_to_play_availability_slots_updated_at on public.pay_to_play_availability_slots;
create trigger trg_pay_to_play_availability_slots_updated_at
before update on public.pay_to_play_availability_slots
for each row execute function public.set_updated_at();

alter table public.pay_to_play_listing_media enable row level security;
alter table public.pay_to_play_availability_slots enable row level security;

drop policy if exists "pay_to_play_listing_media_read" on public.pay_to_play_listing_media;
create policy "pay_to_play_listing_media_read"
on public.pay_to_play_listing_media for select
to authenticated
using (
  exists (
    select 1
    from public.pay_to_play_offers o
    where o.id = offer_id
      and (o.is_active = true or o.provider_id = auth.uid())
  )
);

drop policy if exists "pay_to_play_listing_media_write_own" on public.pay_to_play_listing_media;
create policy "pay_to_play_listing_media_write_own"
on public.pay_to_play_listing_media for all
to authenticated
using (
  exists (
    select 1
    from public.pay_to_play_offers o
    where o.id = offer_id
      and o.provider_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.pay_to_play_offers o
    where o.id = offer_id
      and o.provider_id = auth.uid()
  )
);

drop policy if exists "pay_to_play_availability_slots_read" on public.pay_to_play_availability_slots;
create policy "pay_to_play_availability_slots_read"
on public.pay_to_play_availability_slots for select
to authenticated
using (is_booked = false or provider_id = auth.uid());

drop policy if exists "pay_to_play_availability_slots_write_own" on public.pay_to_play_availability_slots;
create policy "pay_to_play_availability_slots_write_own"
on public.pay_to_play_availability_slots for all
to authenticated
using (provider_id = auth.uid())
with check (provider_id = auth.uid());

