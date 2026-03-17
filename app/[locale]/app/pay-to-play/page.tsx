'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Crown, DollarSign, Gamepad2, LayoutDashboard, Loader2, Star } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { getGameAssetUrl } from '@/lib/assets';
import { supabase, TABLES } from '@/lib/supabase';
import posthog from 'posthog-js';

interface HostCard {
  providerId: string;
  gamertag: string;
  profileImageUrl?: string;
  heroImageUrl?: string;
  headline: string;
  bio: string;
  games: string[];
  rating: number;
  completedSessions: number;
  lowestPriceCents: number;
  currency: string;
  offerCount: number;
  locationType: string;
  hasInstantBook: boolean;
  featuredRank: number | null;
}

const formatPrice = (priceCents: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').trim(),
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

export default function PayToPlayPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [hosts, setHosts] = useState<HostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        setLoading(true);
        const { data: profiles, error: profilesError } = await supabase
          .from(TABLES.PAY_TO_PLAY_PROFILES)
          .select(
            'user_id,headline,about,is_featured,is_active,featured_rank,average_rating,total_completed_bookings'
          )
          .eq('is_featured', true)
          .eq('is_active', true)
          .order('featured_rank', { ascending: true });

        if (profilesError) {
          console.error('Error loading featured pay-to-play profiles:', profilesError);
          setHosts([]);
          return;
        }

        const providerIds = [...new Set((profiles ?? []).map((profile) => profile.user_id))];
        if (providerIds.length === 0) {
          setHosts([]);
          return;
        }

        const [usersResponse, offersResponse, userGamesResponse] = await Promise.all([
          supabase
            .from(TABLES.USERS)
            .select('id,gamertag,bio,profile_image_url')
            .in('id', providerIds),
          supabase
            .from(TABLES.PAY_TO_PLAY_OFFERS)
            .select(
              'id,provider_id,title,description,game_name,price_cents,currency,duration_minutes,booking_notice_hours,location_type,instant_book,is_active'
            )
            .eq('is_active', true)
            .in('provider_id', providerIds),
          supabase
            .from(TABLES.USER_GAMES)
            .select('user_id, game_id')
            .in('user_id', providerIds),
        ]);

        if (usersResponse.error) {
          console.error('Error loading featured users for pay-to-play:', usersResponse.error);
          setHosts([]);
          return;
        }

        if (offersResponse.error) {
          console.error('Error loading pay-to-play listings:', offersResponse.error);
          setHosts([]);
          return;
        }

        const offers = offersResponse.data ?? [];
        if (offers.length === 0) {
          setHosts([]);
          return;
        }

        const userGamesRows = userGamesResponse.data ?? [];
        const gameIds = [...new Set(userGamesRows.map((r) => r.game_id).filter(Boolean))];
        let gamesById: Record<string, { display_name: string | null; name: string }> = {};
        if (gameIds.length > 0) {
          const { data: gamesData } = await supabase
            .from(TABLES.GAMES)
            .select('id, display_name, name')
            .in('id', gameIds);
          gamesById = (gamesData ?? []).reduce<Record<string, { display_name: string | null; name: string }>>(
            (acc, g) => {
              acc[g.id] = { display_name: g.display_name ?? null, name: g.name };
              return acc;
            },
            {}
          );
        }
        const gamesByProviderId: Record<string, string[]> = {};
        for (const row of userGamesRows) {
          const game = gamesById[row.game_id];
          if (!game) continue;
          const label = game.display_name ?? game.name ?? '';
          if (!label) continue;
          if (!gamesByProviderId[row.user_id]) gamesByProviderId[row.user_id] = [];
          if (!gamesByProviderId[row.user_id].includes(label)) {
            gamesByProviderId[row.user_id].push(label);
          }
        }

        const { data: media, error: mediaError } = await supabase
          .from(TABLES.PAY_TO_PLAY_LISTING_MEDIA)
          .select('offer_id,media_url,media_type,is_cover,sort_order')
          .in(
            'offer_id',
            offers.map((offer) => offer.id)
          )
          .order('is_cover', { ascending: false })
          .order('sort_order', { ascending: true });

        if (mediaError) {
          console.error('Error loading pay-to-play listing media:', mediaError);
        }

        const profilesByProvider = (profiles ?? []).reduce<Record<string, (typeof profiles)[number]>>(
          (acc, row) => {
            acc[row.user_id] = row;
            return acc;
          },
          {}
        );

        const usersById = (usersResponse.data ?? []).reduce<Record<string, (typeof usersResponse.data)[number]>>(
          (acc, row) => {
            acc[row.id] = row;
            return acc;
          },
          {}
        );

        // Prefer image media for card hero; skip videos (they can't render in <Image>)
        const mediaByOffer = (media ?? []).reduce<Record<string, string>>((acc, item) => {
          if (!acc[item.offer_id] && item.media_type !== 'video') {
            acc[item.offer_id] = item.media_url;
          }
          return acc;
        }, {});

        // Group offers by provider to create one card per host
        const hostMap = new Map<string, HostCard>();

        for (const offer of offers) {
          const profile = profilesByProvider[offer.provider_id];
          const user = usersById[offer.provider_id];
          if (!profile || !user?.gamertag) continue;

          const priceCents = Number(offer.price_cents ?? 0);

          if (hostMap.has(offer.provider_id)) {
            const existing = hostMap.get(offer.provider_id)!;
            existing.offerCount += 1;
            if (priceCents < existing.lowestPriceCents) {
              existing.lowestPriceCents = priceCents;
              existing.currency = offer.currency || 'USD';
            }
            if (offer.instant_book) existing.hasInstantBook = true;
            if (!existing.heroImageUrl && mediaByOffer[offer.id]) {
              existing.heroImageUrl = mediaByOffer[offer.id];
            }
            continue;
          }

          const userGames = gamesByProviderId[offer.provider_id];
          const games =
            userGames && userGames.length > 0
              ? userGames
              : offer.game_name
                ? [offer.game_name]
                : ['Any Game'];

          hostMap.set(offer.provider_id, {
            providerId: offer.provider_id,
            gamertag: user.gamertag,
            profileImageUrl: user.profile_image_url,
            heroImageUrl: mediaByOffer[offer.id],
            headline: profile.headline || offer.title?.trim() || 'Game Session',
            bio: profile.about?.trim() || user.bio?.trim() || 'No description yet.',
            games: games.slice(0, 3),
            rating: Number(profile.average_rating ?? 0),
            completedSessions: Number(profile.total_completed_bookings ?? 0),
            lowestPriceCents: priceCents,
            currency: offer.currency || 'USD',
            offerCount: 1,
            locationType: offer.location_type || 'online',
            hasInstantBook: Boolean(offer.instant_book),
            featuredRank: profile.featured_rank,
          });
        }

        const next = Array.from(hostMap.values()).sort((a, b) => {
          const rankA = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
          const rankB = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
          if (rankA !== rankB) return rankA - rankB;
          return b.rating - a.rating;
        });

        setHosts(next);
      } catch (error) {
        console.error('Unexpected error loading pay-to-play marketplace listings:', error);
        setHosts([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchFeaturedListings();
  }, []);

  return (
    <div className="relative flex-1 overflow-y-auto bg-background">
      <div className="relative container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Crown className="text-primary" />
              Pay to Play
            </h1>
            <p className="text-white/60">
              Book sessions with featured gamers. Choose hourly coaching or pay per match.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/${locale}/app/pay-to-play/bookings`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Calendar size={14} />
              <span className="hidden sm:inline">My Bookings</span>
            </Link>
            <Link
              href={`/${locale}/app/pay-to-play/become-host`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary/20"
            >
              <Crown size={14} />
              <span className="hidden sm:inline">Become a Host</span>
            </Link>
            <Link
              href={`/${locale}/app/pay-to-play/dashboard`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative h-56 w-full bg-white/10 animate-pulse" />
                <div className="space-y-3 p-3">
                  <div className="h-3 w-full rounded bg-white/10 animate-pulse" />
                  <div className="h-3 w-4/5 rounded bg-white/10 animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-10 rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-14 rounded bg-white/10 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-xl border border-white/15 bg-black/20 p-3">
                      <div className="mb-1 h-3 w-16 rounded bg-white/10 animate-pulse" />
                      <div className="h-4 w-12 rounded bg-white/10 animate-pulse" />
                    </div>
                    <div className="rounded-xl border border-white/15 bg-black/20 p-3">
                      <div className="mb-1 h-3 w-14 rounded bg-white/10 animate-pulse" />
                      <div className="h-4 w-10 rounded bg-white/10 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-white/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : hosts.length === 0 ? (
          <p className="text-white/60">No featured listings found yet. Activate featured profiles and offers in Supabase.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hosts.map((host) => (
              <article
                key={host.providerId}
                onClick={() => {
                  posthog.capture('pay_to_play_listing_clicked', {
                    gamertag: host.gamertag,
                    price_cents: host.lowestPriceCents,
                    currency: host.currency,
                    games: host.games,
                    offer_count: host.offerCount,
                  });
                  router.push(`/${locale}/app/pay-to-play/${encodeURIComponent(host.gamertag)}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    posthog.capture('pay_to_play_listing_clicked', {
                      gamertag: host.gamertag,
                      price_cents: host.lowestPriceCents,
                      currency: host.currency,
                      games: host.games,
                      offer_count: host.offerCount,
                    });
                    router.push(`/${locale}/app/pay-to-play/${encodeURIComponent(host.gamertag)}`);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-primary/40 hover:bg-white/[0.07]"
              >
                <div className="relative h-44 shrink-0 overflow-hidden bg-gradient-to-br from-red-500/25 via-black/40 to-zinc-900/80">
                  {(host.heroImageUrl || host.profileImageUrl) ? (
                    <Image
                      src={host.heroImageUrl || host.profileImageUrl || ''}
                      alt={host.gamertag}
                      fill
                      className="object-cover object-center opacity-90"
                      unoptimized
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Gamepad2 size={40} className="text-white/15" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                    <Crown size={10} />
                    Featured
                  </div>
                  {host.hasInstantBook && (
                    <div className="absolute right-2.5 top-2.5 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-200">
                      Instant
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5">
                    <p className="text-sm font-semibold">@{host.gamertag}</p>
                    <p className="line-clamp-1 text-[11px] text-white/70">{host.headline}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-2.5">
                  <p className="line-clamp-2 text-[11px] text-white/80">{host.bio}</p>

                  <div className="flex min-h-[24px] flex-wrap gap-1.5">
                    {(host.games.length > 0 ? host.games : ['Any Game']).slice(0, 3).map((game) => (
                      <span
                        key={game}
                        className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-[11px] text-white/85"
                      >
                        {game !== 'Any Game' ? (
                          <Image
                            src={getGameAssetUrl(game)}
                            alt={game}
                            width={14}
                            height={14}
                            className="rounded-sm"
                            unoptimized
                          />
                        ) : (
                          <Gamepad2 size={12} />
                        )}
                        {game}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} className="text-primary" />
                      {host.rating.toFixed(1)}
                    </span>
                    <span>{host.completedSessions} sessions</span>
                    <span className="rounded-full border border-white/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/65">
                      {host.locationType.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-white/15 bg-black/20 px-2.5 py-2">
                      <p className="text-[10px] text-white/60">
                        {host.offerCount > 1
                          ? <>{host.offerCount} offers, starting price</>
                          : 'Price'}
                      </p>
                      <span className="text-xs font-semibold text-white">{formatPrice(host.lowestPriceCents, host.currency)}</span>
                    </div>

                    <Link
                      href={`/${locale}/app/pay-to-play/${encodeURIComponent(host.gamertag)}`}
                      className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-primary px-3 text-xs font-medium text-white transition hover:bg-primary/90"
                    >
                      <Gamepad2 size={13} />
                      {host.offerCount > 1 ? 'View Offers' : 'Play'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
