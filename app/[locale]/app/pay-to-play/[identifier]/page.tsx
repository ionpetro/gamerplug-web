'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Crown, Gamepad2, Loader2, Star, Timer, Zap } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { getGameAssetUrl } from '@/lib/assets';
import { supabase, TABLES } from '@/lib/supabase';
import posthog from 'posthog-js';
import BookingCard from '@/components/pay-to-play/BookingCard';

interface OfferItem {
  offerId: string;
  title: string;
  description: string;
  serviceType: string;
  priceCents: number;
  currency: string;
  durationMinutes: number;
  bookingNoticeHours: number;
  locationType: string;
  instantBook: boolean;
}

interface HostDetail {
  providerId: string;
  gamertag: string;
  profileImageUrl?: string;
  headline: string;
  about: string;
  games: string[];
  rating: number;
  completedSessions: number;
  media: { url: string; type: 'image' | 'video' }[];
  offers: OfferItem[];
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  coaching: 'Coaching',
  duo_queue: 'Duo Queue',
  carry: 'Carry',
  team_session: 'Team Session',
  live_stream: 'Live Stream Play',
};

const formatPrice = (cents: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(cents / 100);

export default function PayToPlayListingPage() {
  const params = useParams();
  const identifier = decodeURIComponent(params.identifier as string);
  const { locale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [host, setHost] = useState<HostDetail | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHost = async () => {
      try {
        setLoading(true);
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(identifier);

        // Resolve provider ID
        let providerId: string | null = null;
        let preselectedOfferId: string | null = null;

        if (isUuid) {
          // Could be an offer ID — resolve the provider from it
          const { data: offerRow } = await supabase
            .from(TABLES.PAY_TO_PLAY_OFFERS)
            .select('id,provider_id')
            .eq('id', identifier)
            .eq('is_active', true)
            .maybeSingle();
          if (offerRow) {
            providerId = offerRow.provider_id;
            preselectedOfferId = offerRow.id;
          }
        } else {
          const { data: hostUser } = await supabase
            .from(TABLES.USERS)
            .select('id')
            .ilike('gamertag', identifier)
            .maybeSingle();
          if (hostUser) providerId = hostUser.id;
        }

        if (!providerId) {
          setHost(null);
          return;
        }

        // Fetch all data in parallel
        const [profileResponse, userResponse, offersResponse, clipsResponse, userGamesResponse] = await Promise.all([
          supabase
            .from(TABLES.PAY_TO_PLAY_PROFILES)
            .select('headline,about,average_rating,total_completed_bookings,is_active,is_featured')
            .eq('user_id', providerId)
            .maybeSingle(),
          supabase
            .from(TABLES.USERS)
            .select('id,gamertag,profile_image_url,bio')
            .eq('id', providerId)
            .maybeSingle(),
          supabase
            .from(TABLES.PAY_TO_PLAY_OFFERS)
            .select(
              'id,provider_id,title,description,service_type,game_name,price_cents,currency,duration_minutes,booking_notice_hours,location_type,instant_book,is_active,created_at'
            )
            .eq('provider_id', providerId)
            .eq('is_active', true)
            .order('created_at', { ascending: true }),
          supabase
            .from(TABLES.CLIPS)
            .select('video_url,created_at')
            .eq('user_id', providerId)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(6),
          supabase
            .from(TABLES.USER_GAMES)
            .select('game_id')
            .eq('user_id', providerId),
        ]);

        if (userResponse.error || !userResponse.data) {
          setHost(null);
          return;
        }

        const allOffers = offersResponse.data ?? [];
        if (allOffers.length === 0) {
          setHost(null);
          return;
        }

        // Fetch listing media for all offers
        const offerIds = allOffers.map((o) => o.id);
        const { data: mediaData } = await supabase
          .from(TABLES.PAY_TO_PLAY_LISTING_MEDIA)
          .select('offer_id,media_url,media_type,is_cover,sort_order')
          .in('offer_id', offerIds)
          .order('is_cover', { ascending: false })
          .order('sort_order', { ascending: true });

        const listingMedia = (mediaData ?? []).map((item) => ({
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

        // Resolve user's games
        const userGameIds = (userGamesResponse.data ?? []).map((r) => r.game_id).filter(Boolean);
        let gameNames: string[] = [];
        if (userGameIds.length > 0) {
          const { data: gamesData } = await supabase
            .from(TABLES.GAMES)
            .select('id,display_name,name')
            .in('id', userGameIds);
          gameNames = (gamesData ?? []).map((g) => g.display_name ?? g.name).filter(Boolean);
        }
        // Fallback to the first offer's game_name, then "Any Game"
        if (gameNames.length === 0) {
          const fallback = allOffers.find((o) => o.game_name)?.game_name;
          if (fallback) gameNames = [fallback];
        }
        if (gameNames.length === 0) {
          gameNames = ['Any Game'];
        }

        const offers: OfferItem[] = allOffers.map((o) => ({
          offerId: o.id,
          title: o.title?.trim() || 'Game Session',
          description: o.description?.trim() || '',
          serviceType: o.service_type || 'coaching',
          priceCents: Number(o.price_cents ?? 0),
          currency: o.currency || 'USD',
          durationMinutes: Number(o.duration_minutes ?? 60),
          bookingNoticeHours: Number(o.booking_notice_hours ?? 24),
          locationType: o.location_type || 'online',
          instantBook: Boolean(o.instant_book),
        }));

        setHost({
          providerId,
          gamertag: user.gamertag,
          profileImageUrl: user.profile_image_url,
          headline: profile?.headline || offers[0]?.title || 'Game Host',
          about: profile?.about?.trim() || user.bio?.trim() || 'No description yet.',
          games: gameNames.slice(0, 5),
          rating: Number(profile?.average_rating ?? 0),
          completedSessions: Number(profile?.total_completed_bookings ?? 0),
          media,
          offers,
        });

        // Pre-select offer if navigated via UUID, otherwise first offer
        setSelectedOfferId(preselectedOfferId || offers[0]?.offerId || null);
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      void fetchHost();
    }
  }, [identifier]);

  const activeMedia = useMemo(() => {
    if (!host) return null;
    return host.media[activeMediaIndex] ?? null;
  }, [host, activeMediaIndex]);

  const activeOffer = useMemo(() => {
    if (!host) return null;
    return host.offers.find((o) => o.offerId === selectedOfferId) ?? host.offers[0] ?? null;
  }, [host, selectedOfferId]);

  if (loading) {
    return (
      <div className="relative flex-1 overflow-hidden bg-background">
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
                <div className="space-y-2 py-2">
                  <div className="h-48 w-full rounded-lg bg-white/10 animate-pulse" />
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

  if (!host) {
    return (
      <div className="container mx-auto max-w-4xl px-6 py-10">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back
        </Link>
        <p className="text-white/70">Host not found.</p>
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <div className="relative container mx-auto max-w-5xl px-6 py-8">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-4 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="space-y-4">
            {/* Host profile card */}
            <article className="overflow-hidden rounded-2xl bg-white/5">
              {activeMedia?.type === 'video' ? (
                <div className="relative w-full bg-black">
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    muted
                    loop
                    className="aspect-video w-full"
                    playsInline
                  />
                </div>
              ) : (
                <div className="relative h-[420px] w-full overflow-hidden bg-black/40 sm:h-[520px]">
                  {activeMedia?.url || host.profileImageUrl ? (
                    <Image
                      src={activeMedia?.url || host.profileImageUrl || ''}
                      alt={host.gamertag}
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
                  <div className="absolute bottom-4 left-4">
                    <p className="text-2xl font-bold">@{host.gamertag}</p>
                    <p className="text-sm text-white/75">{host.headline}</p>
                  </div>
                </div>
              )}

              {host.media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {host.media.map((item, index) => (
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
                  {host.profileImageUrl ? (
                    <Image
                      src={host.profileImageUrl}
                      alt={host.gamertag}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {host.gamertag.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">Hosted by @{host.gamertag}</p>
                    <p className="text-xs text-white/65">
                      {host.rating.toFixed(1)} rating · {host.completedSessions} sessions
                    </p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/app/profile/${encodeURIComponent(host.gamertag)}`}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                >
                  View Profile
                </Link>
              </div>

              <div className="space-y-5 p-5">
                <p className="text-white/85">{host.about}</p>

                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {host.games.map((game) => (
                    <span key={game} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/85">
                      {game === 'Any Game' ? (
                        <Gamepad2 size={14} className="shrink-0" />
                      ) : (
                        <Image src={getGameAssetUrl(game)} alt={game} width={14} height={14} className="rounded-sm shrink-0" unoptimized />
                      )}
                      {game}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/85">
                    <Star size={13} className="text-primary" />
                    {host.rating.toFixed(1)}
                  </span>
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-white/80">
                    {host.completedSessions} sessions
                  </span>
                </div>
              </div>
            </article>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* Offers list */}
            {host.offers.length > 1 && (
              <div className="space-y-2">
                <h2 className="text-sm font-bold">
                  {host.offers.length} Offers Available
                </h2>
                {host.offers.map((offer) => (
                  <button
                    key={offer.offerId}
                    onClick={() => setSelectedOfferId(offer.offerId)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      selectedOfferId === offer.offerId
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold">{offer.title}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {offer.serviceType.split(',').map((st) => (
                            <span key={st} className="rounded-full border border-white/15 bg-black/20 px-1.5 py-0.5 text-[10px] text-white/60">
                              {SERVICE_TYPE_LABELS[st.trim()] ?? st.trim()}
                            </span>
                          ))}
                          <span className="inline-flex items-center gap-1 text-[10px] text-white/50">
                            <Timer size={10} />
                            {offer.durationMinutes} min
                          </span>
                          {offer.instantBook && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300">
                              <Zap size={10} />
                              Instant
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="shrink-0 text-xs font-bold">{formatPrice(offer.priceCents, offer.currency)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeOffer && (
              <BookingCard
                offerId={activeOffer.offerId}
                providerId={host.providerId}
                providerGamertag={host.gamertag}
                priceCents={activeOffer.priceCents}
                currency={activeOffer.currency}
                durationMinutes={activeOffer.durationMinutes}
                bookingNoticeHours={activeOffer.bookingNoticeHours}
                instantBook={activeOffer.instantBook}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
