'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, DollarSign, Gamepad2, Loader2, Star, Timer } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { getGameAssetUrl } from '@/lib/assets';
import { supabase, TABLES } from '@/lib/supabase';

interface FeaturedListing {
  id: string;
  offerId: string;
  providerId: string;
  gamertag: string;
  profileImageUrl?: string;
  heroImageUrl?: string;
  title: string;
  bio: string;
  games: string[];
  rating: number;
  completedSessions: number;
  priceCents: number;
  currency: string;
  durationMinutes: number;
  locationType: string;
  instantBook: boolean;
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
  const [listings, setListings] = useState<FeaturedListing[]>([]);
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
          setListings([]);
          return;
        }

        const providerIds = [...new Set((profiles ?? []).map((profile) => profile.user_id))];
        if (providerIds.length === 0) {
          setListings([]);
          return;
        }

        const [usersResponse, offersResponse] = await Promise.all([
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
        ]);

        if (usersResponse.error) {
          console.error('Error loading featured users for pay-to-play:', usersResponse.error);
          setListings([]);
          return;
        }

        if (offersResponse.error) {
          console.error('Error loading pay-to-play listings:', offersResponse.error);
          setListings([]);
          return;
        }

        const offers = offersResponse.data ?? [];
        if (offers.length === 0) {
          setListings([]);
          return;
        }

        const { data: media, error: mediaError } = await supabase
          .from(TABLES.PAY_TO_PLAY_LISTING_MEDIA)
          .select('offer_id,media_url,is_cover,sort_order')
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

        const mediaByOffer = (media ?? []).reduce<Record<string, string>>((acc, item) => {
          if (!acc[item.offer_id]) {
            acc[item.offer_id] = item.media_url;
          }
          return acc;
        }, {});

        const next = offers
          .map((offer) => {
            const profile = profilesByProvider[offer.provider_id];
            const user = usersById[offer.provider_id];
            if (!profile || !user?.gamertag) {
              return null;
            }

            const games = offer.game_name ? [offer.game_name] : ['Any Game'];

            return {
              id: `${offer.provider_id}-${offer.id}`,
              offerId: offer.id,
              providerId: offer.provider_id,
              gamertag: user.gamertag,
              profileImageUrl: user.profile_image_url,
              heroImageUrl: mediaByOffer[offer.id],
              title: offer.title?.trim() || profile.headline || 'Game Session',
              bio: offer.description?.trim() || profile.about?.trim() || user.bio?.trim() || 'No description yet.',
              games: games.slice(0, 3),
              rating: Number(profile.average_rating ?? 0),
              completedSessions: Number(profile.total_completed_bookings ?? 0),
              priceCents: Number(offer.price_cents ?? 0),
              currency: offer.currency || 'USD',
              durationMinutes: Number(offer.duration_minutes ?? 60),
              locationType: offer.location_type || 'online',
              instantBook: Boolean(offer.instant_book),
              featuredRank: profile.featured_rank,
            } as FeaturedListing;
          })
          .filter((listing): listing is FeaturedListing => Boolean(listing))
          .sort((a, b) => {
            const rankA = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
            const rankB = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
            if (rankA !== rankB) return rankA - rankB;
            return b.rating - a.rating;
          });

        setListings(next);
      } catch (error) {
        console.error('Unexpected error loading pay-to-play marketplace listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchFeaturedListings();
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/25 blur-[200px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
      </div>

      <div className="relative container mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Crown className="text-primary" />
              Pay to Play
            </h1>
            <p className="text-white/60">
              Book sessions with featured gamers. Choose hourly coaching or pay per match.
            </p>
          </div>
          <Link
            href={`/${locale}/app/matches`}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            Back to Matches
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-white/60">No featured listings found yet. Activate featured profiles and offers in Supabase.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <article
                key={listing.id}
                onClick={() => router.push(`/${locale}/app/pay-to-play/${encodeURIComponent(listing.gamertag)}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/${locale}/app/pay-to-play/${encodeURIComponent(listing.gamertag)}`);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:border-primary/40 hover:bg-white/[0.07]"
              >
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-red-500/25 via-black/40 to-zinc-900/80">
                  {listing.heroImageUrl || listing.profileImageUrl ? (
                    <Image
                      src={listing.heroImageUrl || listing.profileImageUrl || ''}
                      alt={listing.gamertag}
                      fill
                      className="object-cover object-center opacity-90"
                      unoptimized
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                    <Crown size={12} />
                    Featured
                  </div>
                  {listing.instantBook && (
                    <div className="absolute right-3 top-3 rounded-full border border-emerald-300/40 bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
                      Instant
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <p className="text-base font-semibold">@{listing.gamertag}</p>
                    <p className="line-clamp-1 text-xs text-white/70">{listing.title}</p>
                  </div>
                </div>

                <div className="space-y-3 p-3">
                  <p className="line-clamp-2 text-xs text-white/80">{listing.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {(listing.games.length > 0 ? listing.games : ['Any Game']).slice(0, 3).map((game) => (
                      <span
                        key={game}
                        className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-xs text-white/85"
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

                  <div className="flex items-center gap-3 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} className="text-primary" />
                      {listing.rating.toFixed(1)}
                    </span>
                    <span>{listing.completedSessions} sessions</span>
                    <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/65">
                      {listing.locationType.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-xl border border-white/15 bg-black/20 p-3">
                      <p className="mb-1 inline-flex items-center gap-1 text-xs text-white/60">
                        <DollarSign size={12} />
                        Listing Price
                      </p>
                      <p className="text-xs font-semibold">{formatPrice(listing.priceCents, listing.currency)}</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-black/20 p-3">
                      <p className="mb-1 inline-flex items-center gap-1 text-xs text-white/60">
                        <Timer size={12} />
                        Duration
                      </p>
                      <p className="text-xs font-semibold">{listing.durationMinutes} min</p>
                    </div>
                  </div>

                  <div className="flex">
                    <Link
                      href={`/${locale}/app/pay-to-play/${encodeURIComponent(listing.gamertag)}`}
                      className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary/90"
                    >
                      <Gamepad2 size={14} />
                      Play
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
