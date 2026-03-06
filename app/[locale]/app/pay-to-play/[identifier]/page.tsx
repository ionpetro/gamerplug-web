'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Crown, DollarSign, Gamepad2, Loader2, MapPin, Star, Timer } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { getGameAssetUrl } from '@/lib/assets';
import { supabase, TABLES } from '@/lib/supabase';
import posthog from 'posthog-js';

interface ListingDetail {
  offerId: string;
  providerId: string;
  gamertag: string;
  profileImageUrl?: string;
  headline: string;
  description: string;
  gameName: string;
  priceCents: number;
  currency: string;
  durationMinutes: number;
  bookingNoticeHours: number;
  locationType: string;
  instantBook: boolean;
  rating: number;
  completedSessions: number;
  media: { url: string; type: 'image' | 'video' }[];
}

const formatPrice = (priceCents: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').trim(),
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

const toLocalDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PayToPlayListingPage() {
  const params = useParams();
  const identifier = decodeURIComponent(params.identifier as string);
  const router = useRouter();
  const { locale } = useI18n();
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(identifier);

        let offer = null as {
          id: string;
          provider_id: string;
          title: string | null;
          description: string | null;
          game_name: string | null;
          price_cents: number;
          currency: string;
          duration_minutes: number;
          booking_notice_hours: number;
          location_type: string;
          instant_book: boolean;
          is_active: boolean;
          created_at: string;
        } | null;
        let offerError = null as unknown;

        if (isUuid) {
          const offerResponse = await supabase
            .from(TABLES.PAY_TO_PLAY_OFFERS)
            .select(
              'id,provider_id,title,description,game_name,price_cents,currency,duration_minutes,booking_notice_hours,location_type,instant_book,is_active,created_at'
            )
            .eq('id', identifier)
            .eq('is_active', true)
            .maybeSingle();
          offer = offerResponse.data;
          offerError = offerResponse.error;
        } else {
          const { data: hostUser, error: hostError } = await supabase
            .from(TABLES.USERS)
            .select('id')
            .ilike('gamertag', identifier)
            .maybeSingle();

          if (hostError || !hostUser) {
            console.error('Error loading host by username:', hostError);
            setListing(null);
            return;
          }

          const offerResponse = await supabase
            .from(TABLES.PAY_TO_PLAY_OFFERS)
            .select(
              'id,provider_id,title,description,game_name,price_cents,currency,duration_minutes,booking_notice_hours,location_type,instant_book,is_active,created_at'
            )
            .eq('provider_id', hostUser.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          offer = offerResponse.data;
          offerError = offerResponse.error;
        }

        if (offerError || !offer) {
          console.error('Error loading pay-to-play offer:', offerError);
          setListing(null);
          return;
        }

        const [profileResponse, userResponse, mediaResponse, clipsResponse] = await Promise.all([
          supabase
            .from(TABLES.PAY_TO_PLAY_PROFILES)
            .select('headline,about,average_rating,total_completed_bookings,is_active,is_featured')
            .eq('user_id', offer.provider_id)
            .maybeSingle(),
          supabase
            .from(TABLES.USERS)
            .select('id,gamertag,profile_image_url,bio')
            .eq('id', offer.provider_id)
            .maybeSingle(),
          supabase
            .from(TABLES.PAY_TO_PLAY_LISTING_MEDIA)
            .select('media_url,media_type,is_cover,sort_order')
            .eq('offer_id', offer.id)
            .order('is_cover', { ascending: false })
            .order('sort_order', { ascending: true }),
          supabase
            .from(TABLES.CLIPS)
            .select('video_url,created_at')
            .eq('user_id', offer.provider_id)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(6),
        ]);

        if (userResponse.error || !userResponse.data) {
          console.error('Error loading listing host user:', userResponse.error);
          setListing(null);
          return;
        }

        if (profileResponse.error) {
          console.error('Error loading listing host profile:', profileResponse.error);
        }

        if (mediaResponse.error) {
          console.error('Error loading listing media:', mediaResponse.error);
        }
        if (clipsResponse.error) {
          console.error('Error loading profile clips for listing media:', clipsResponse.error);
        }

        const listingMedia = (mediaResponse.data ?? []).map((item) => ({
          url: item.media_url,
          type: (item.media_type === 'video' ? 'video' : 'image') as 'image' | 'video',
        }));
        const clipMedia = (clipsResponse.data ?? []).map((clip) => ({
          url: clip.video_url,
          type: 'video' as const,
        }));
        const seen = new Set<string>();
        const media = [...listingMedia, ...clipMedia].filter((item) => {
          if (!item.url || seen.has(item.url)) return false;
          seen.add(item.url);
          return true;
        });
        const profile = profileResponse.data;
        const user = userResponse.data;

        const defaultStart = new Date(Date.now() + Number(offer.booking_notice_hours ?? 24) * 60 * 60 * 1000);
        const defaultEnd = new Date(defaultStart.getTime() + 24 * 60 * 60 * 1000);
        setCheckInDate(toLocalDateInput(defaultStart));
        setCheckOutDate(toLocalDateInput(defaultEnd));

        setListing({
          offerId: offer.id,
          providerId: offer.provider_id,
          gamertag: user.gamertag,
          profileImageUrl: user.profile_image_url,
          headline: offer.title?.trim() || profile?.headline || 'Game Session',
          description:
            offer.description?.trim() || profile?.about?.trim() || user.bio?.trim() || 'No description yet.',
          gameName: offer.game_name || 'Any Game',
          priceCents: Number(offer.price_cents ?? 0),
          currency: offer.currency || 'USD',
          durationMinutes: Number(offer.duration_minutes ?? 60),
          bookingNoticeHours: Number(offer.booking_notice_hours ?? 24),
          locationType: offer.location_type || 'online',
          instantBook: Boolean(offer.instant_book),
          rating: Number(profile?.average_rating ?? 0),
          completedSessions: Number(profile?.total_completed_bookings ?? 0),
          media,
        });
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      void fetchListing();
    }
  }, [identifier]);

  const activeMedia = useMemo(() => {
    if (!listing) return null;
    return listing.media[activeMediaIndex] ?? null;
  }, [listing, activeMediaIndex]);

  const handleBook = async () => {
    if (!listing) return;

    if (!authUser?.id) {
      router.push(`/${locale}/login?returnUrl=/${locale}/app/pay-to-play/${encodeURIComponent(listing.gamertag)}`);
      return;
    }

    if (authUser.id === listing.providerId) {
      setMessage({ type: 'error', text: 'You cannot book your own listing.' });
      return;
    }

    try {
      setBookingLoading(true);
      setMessage(null);

      const start = checkInDate ? new Date(`${checkInDate}T12:00:00`) : null;
      const end = checkOutDate ? new Date(`${checkOutDate}T12:00:00`) : null;

      if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        setMessage({ type: 'error', text: 'Please select valid check-in and check-out dates.' });
        return;
      }

      if (end <= start) {
        setMessage({ type: 'error', text: 'Check-out must be after check-in.' });
        return;
      }

      const { error } = await supabase.from(TABLES.PAY_TO_PLAY_BOOKINGS).insert({
        offer_id: listing.offerId,
        provider_id: listing.providerId,
        buyer_id: authUser.id,
        status: 'pending',
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        buyer_message: `Requested party size: ${guests}`,
        total_price_cents: listing.priceCents,
        currency: listing.currency,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message || 'Failed to create booking request.' });
        return;
      }

      posthog.capture('pay_to_play_booking_requested', {
        offer_id: listing.offerId,
        provider_gamertag: listing.gamertag,
        price_cents: listing.priceCents,
        currency: listing.currency,
        duration_minutes: listing.durationMinutes,
        game_name: listing.gameName,
        guests,
        instant_book: listing.instantBook,
      });
      setMessage({ type: 'success', text: `Booking request sent to @${listing.gamertag}.` });
    } catch (error) {
      console.error('Unexpected booking error:', error);
      setMessage({ type: 'error', text: 'Unexpected error creating booking request.' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex-1 overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
          <div className="absolute bottom-[-25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/25 blur-[200px]" />
        </div>
        <div className="relative container mx-auto max-w-5xl px-6 py-8">
          <div className="mb-4 h-5 w-24 rounded bg-white/10 animate-pulse" />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
            <article className="overflow-hidden rounded-2xl bg-white/5">
              <div className="relative h-[420px] w-full overflow-hidden bg-white/10 animate-pulse sm:h-[520px]" />
              <div className="flex gap-2 overflow-x-hidden p-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-24 shrink-0 rounded-lg bg-white/10 animate-pulse" />
                ))}
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-white/10 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
                    <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-4/5 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
                  ))}
                </div>
              </div>
            </article>
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-card p-4">
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="h-7 w-20 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="overflow-hidden rounded-xl border border-white/20">
                  <div className="grid grid-cols-2">
                    <div className="border-r border-white/20 bg-black/20 p-3">
                      <div className="mb-1 h-3 w-14 rounded bg-white/10 animate-pulse" />
                      <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
                    </div>
                    <div className="bg-black/20 p-3">
                      <div className="mb-1 h-3 w-16 rounded bg-white/10 animate-pulse" />
                      <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
                    </div>
                  </div>
                  <div className="border-t border-white/20 bg-black/20 p-3">
                    <div className="mb-1 h-3 w-12 rounded bg-white/10 animate-pulse" />
                    <div className="h-8 w-full rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
                <div className="mt-3 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
                <div className="mt-3 h-3 w-full rounded bg-white/10 animate-pulse" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-white/15 bg-black/20 p-2">
                    <div className="mb-1 h-3 w-10 rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-14 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="rounded-lg border border-white/15 bg-black/20 p-2">
                    <div className="mb-1 h-3 w-14 rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back
        </Link>
        <p className="text-white/70">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/25 blur-[200px]" />
      </div>

      <div className="relative container mx-auto max-w-5xl px-6 py-8">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-4 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        {message && (
          <p
            className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
              message.type === 'success'
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          <article className="overflow-hidden rounded-2xl bg-white/5">
            <div className="relative h-[420px] w-full overflow-hidden bg-black/40 sm:h-[520px]">
              {activeMedia?.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  className="h-full w-full object-cover object-center"
                  playsInline
                />
              ) : activeMedia?.url || listing.profileImageUrl ? (
                <Image
                  src={activeMedia?.url || listing.profileImageUrl || ''}
                  alt={listing.gamertag}
                  fill
                  className="object-cover object-center opacity-95"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary">
                <Crown size={12} />
                Featured
              </div>
              {listing.instantBook && (
                <div className="absolute right-4 top-4 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Instant Book
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <p className="text-2xl font-bold">@{listing.gamertag}</p>
                <p className="text-sm text-white/75">{listing.headline}</p>
              </div>
            </div>

            {listing.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {listing.media.map((item, index) => (
                  <button
                    key={`${item.url}-${index}`}
                    onClick={() => setActiveMediaIndex(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border ${
                      index === activeMediaIndex ? 'border-primary/70' : 'border-white/15'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} className="h-full w-full object-cover object-center" muted playsInline />
                    ) : (
                      <Image src={item.url} alt={`media ${index + 1}`} fill className="object-cover object-center" unoptimized />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {listing.profileImageUrl ? (
                  <Image
                    src={listing.profileImageUrl}
                    alt={listing.gamertag}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {listing.gamertag.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">Hosted by @{listing.gamertag}</p>
                  <p className="text-xs text-white/65">
                    {listing.rating.toFixed(1)} rating · {listing.completedSessions} sessions
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/app/profile/${encodeURIComponent(listing.gamertag)}`}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                View Profile
              </Link>
            </div>

            <div className="space-y-5 p-5">
              <p className="text-white/85">{listing.description}</p>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/85">
                  {listing.gameName === 'Any Game' ? (
                    <Gamepad2 size={14} className="shrink-0" />
                  ) : (
                    <Image src={getGameAssetUrl(listing.gameName)} alt={listing.gameName} width={14} height={14} className="rounded-sm shrink-0" unoptimized />
                  )}
                  {listing.gameName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/85">
                  <Star size={13} className="text-primary" />
                  {listing.rating.toFixed(1)}
                </span>
                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/80">
                  {listing.completedSessions} sessions
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/80">
                  <MapPin size={13} />
                  {listing.locationType.replaceAll('_', ' ')}
                </span>
              </div>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-xl">
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-lg font-bold">{formatPrice(listing.priceCents, listing.currency)}</p>
                <span className="text-sm text-white/60">per session</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-white/20">
                <div className="grid grid-cols-2">
                  <label className="border-r border-white/20 bg-black/20 p-3">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/60">Check-in</span>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <label className="bg-black/20 p-3">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/60">Checkout</span>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                </div>
                <label className="block border-t border-white/20 bg-black/20 p-3">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-white/60">Guests</span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option value={1}>1 guest</option>
                    <option value={2}>2 guests</option>
                    <option value={3}>3 guests</option>
                    <option value={4}>4 guests</option>
                  </select>
                </label>
              </div>

              <button
                onClick={() => void handleBook()}
                disabled={bookingLoading}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {bookingLoading ? <Loader2 size={16} className="animate-spin" /> : <Gamepad2 size={16} />}
                Play
              </button>

              <p className="mt-3 text-center text-xs text-white/60">You won&apos;t be charged yet</p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white/15 bg-black/20 p-2">
                  <p className="mb-1 inline-flex items-center gap-1 text-white/60">
                    <DollarSign size={12} />
                    Price
                  </p>
                  <p className="font-semibold">{formatPrice(listing.priceCents, listing.currency)}</p>
                </div>
                <div className="rounded-lg border border-white/15 bg-black/20 p-2">
                  <p className="mb-1 inline-flex items-center gap-1 text-white/60">
                    <Timer size={12} />
                    Duration
                  </p>
                  <p className="font-semibold">{listing.durationMinutes} min</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
