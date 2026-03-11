'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, Crown, DollarSign, Loader2, Star } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, TABLES } from '@/lib/supabase';
import type { PayToPlayBookingStatus } from '@/lib/supabase';
import AvailabilityEditor from '@/components/pay-to-play/AvailabilityEditor';
import BookingRequestCard from '@/components/pay-to-play/BookingRequestCard';

type Tab = 'requests' | 'upcoming' | 'availability' | 'history';

interface Booking {
  id: string;
  offer_id: string;
  buyer_id: string;
  status: PayToPlayBookingStatus;
  scheduled_start: string;
  scheduled_end: string;
  buyer_message?: string | null;
  total_price_cents: number;
  currency: string;
  created_at: string;
}

interface BuyerInfo {
  gamertag: string;
  profile_image_url?: string | null;
}

interface OfferInfo {
  id: string;
  title: string | null;
}

const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').trim(),
    maximumFractionDigits: 0,
  }).format(cents / 100);

type ProfileState = 'loading' | 'none' | 'pending_review' | 'active';

export default function ProviderDashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { locale } = useI18n();
  const router = useRouter();

  const [profileState, setProfileState] = useState<ProfileState>('loading');
  const [activeTab, setActiveTab] = useState<Tab>('requests');

  // Stats
  const [totalSessions, setTotalSessions] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Bookings data
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [buyersMap, setBuyersMap] = useState<Record<string, BuyerInfo>>({});
  const [offersMap, setOffersMap] = useState<Record<string, OfferInfo>>({});
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Check for provider profile
  useEffect(() => {
    if (!authUser?.id) return;
    const checkProfile = async () => {
      const { data } = await supabase
        .from(TABLES.PAY_TO_PLAY_PROFILES)
        .select('user_id,is_active,average_rating,total_completed_bookings')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (!data) {
        setProfileState('none');
      } else if (!data.is_active) {
        setProfileState('pending_review');
      } else {
        setProfileState('active');
        setAvgRating(Number(data.average_rating ?? 0));
        setTotalSessions(Number(data.total_completed_bookings ?? 0));
      }
    };
    void checkProfile();
  }, [authUser?.id]);

  // Fetch bookings when profile is active
  useEffect(() => {
    if (!authUser?.id || profileState !== 'active') return;
    const fetchBookings = async () => {
      setBookingsLoading(true);
      const { data: bookingsData, error } = await supabase
        .from(TABLES.PAY_TO_PLAY_BOOKINGS)
        .select('id,offer_id,buyer_id,status,scheduled_start,scheduled_end,buyer_message,total_price_cents,currency,created_at')
        .eq('provider_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        setBookingsLoading(false);
        return;
      }

      const bkgs = (bookingsData ?? []) as Booking[];
      setBookings(bkgs);

      const completed = bkgs.filter((b) => b.status === 'completed');
      setTotalEarnings(completed.reduce((sum, b) => sum + b.total_price_cents, 0));

      const buyerIds = [...new Set(bkgs.map((b) => b.buyer_id))];
      if (buyerIds.length > 0) {
        const { data: users } = await supabase
          .from(TABLES.USERS)
          .select('id,gamertag,profile_image_url')
          .in('id', buyerIds);
        const map: Record<string, BuyerInfo> = {};
        for (const u of users ?? []) {
          map[u.id] = { gamertag: u.gamertag, profile_image_url: u.profile_image_url };
        }
        setBuyersMap(map);
      }

      const offerIds = [...new Set(bkgs.map((b) => b.offer_id))];
      if (offerIds.length > 0) {
        const { data: offers } = await supabase
          .from(TABLES.PAY_TO_PLAY_OFFERS)
          .select('id,title')
          .in('id', offerIds);
        const map: Record<string, OfferInfo> = {};
        for (const o of offers ?? []) {
          map[o.id] = { id: o.id, title: o.title };
        }
        setOffersMap(map);
      }

      setBookingsLoading(false);
    };
    void fetchBookings();
  }, [authUser?.id, profileState]);

  const handleAccept = async (bookingId: string) => {
    setActionLoading(true);
    const { error } = await supabase
      .from(TABLES.PAY_TO_PLAY_BOOKINGS)
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', bookingId);
    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'accepted' as const } : b)));
    }
    setActionLoading(false);
  };

  const handleDecline = async (bookingId: string) => {
    setActionLoading(true);
    const { error } = await supabase
      .from(TABLES.PAY_TO_PLAY_BOOKINGS)
      .update({ status: 'declined', declined_at: new Date().toISOString() })
      .eq('id', bookingId);
    if (!error) {
      await supabase
        .from(TABLES.PAY_TO_PLAY_AVAILABILITY_SLOTS)
        .update({ is_booked: false, booking_id: null })
        .eq('booking_id', bookingId);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'declined' as const } : b)));
    }
    setActionLoading(false);
  };

  const handleComplete = async (bookingId: string) => {
    setActionLoading(true);
    const { error } = await supabase
      .from(TABLES.PAY_TO_PLAY_BOOKINGS)
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', bookingId);
    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'completed' as const } : b)));
    }
    setActionLoading(false);
  };

  // Derived booking lists
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const upcomingBookings = bookings
    .filter((b) => b.status === 'accepted')
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());
  const historyBookings = bookings.filter((b) =>
    ['completed', 'declined', 'cancelled_by_buyer', 'cancelled_by_provider'].includes(b.status)
  );

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'requests', label: 'Requests', count: pendingBookings.length },
    { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { key: 'availability', label: 'Availability' },
    { key: 'history', label: 'History' },
  ];

  if (authLoading || profileState === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center bg-background py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser?.id) {
    router.push(`/${locale}/login?returnUrl=/${locale}/app/pay-to-play/dashboard`);
    return null;
  }

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-4 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <Crown className="text-primary" />
          Game Host Dashboard
        </h1>

        {/* No profile — direct to become-host */}
        {profileState === 'none' && (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Crown size={32} className="mx-auto mb-3 text-primary" />
            <h2 className="mb-2 text-lg font-bold">You&apos;re not a Game Host yet</h2>
            <p className="mb-5 text-sm text-white/50">
              Create a listing to start hosting paid gaming sessions.
            </p>
            <Link
              href={`/${locale}/app/pay-to-play/become-host`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <Crown size={14} />
              Become a Game Host
            </Link>
          </div>
        )}

        {/* Pending review */}
        {profileState === 'pending_review' && (
          <div className="mx-auto max-w-md rounded-2xl border border-amber-400/20 bg-amber-500/5 p-8 text-center">
            <Clock size={32} className="mx-auto mb-3 text-amber-400" />
            <h2 className="mb-2 text-lg font-bold">Listing Under Review</h2>
            <p className="text-sm text-white/50">
              We&apos;re reviewing your listing and will publish it shortly. You&apos;ll be able to manage bookings here once you&apos;re live.
            </p>
          </div>
        )}

        {/* Active dashboard */}
        {profileState === 'active' && (
          <>
            {/* Stats bar */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-white/50">
                  <CheckCircle size={12} />
                  Sessions
                </p>
                <p className="text-xl font-bold">{totalSessions}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-white/50">
                  <Star size={12} />
                  Rating
                </p>
                <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-white/50">
                  <DollarSign size={12} />
                  Earnings
                </p>
                <p className="text-xl font-bold">{formatPrice(totalEarnings, 'USD')}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-primary/20 text-primary'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/30 text-[10px] font-bold text-primary">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {bookingsLoading && activeTab !== 'availability' ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            ) : (
              <>
                {activeTab === 'requests' && (
                  <div className="space-y-3">
                    {pendingBookings.length === 0 ? (
                      <p className="py-8 text-center text-sm text-white/40">No pending booking requests.</p>
                    ) : (
                      pendingBookings.map((b) => (
                        <BookingRequestCard
                          key={b.id}
                          booking={b}
                          otherUser={buyersMap[b.buyer_id] ?? { gamertag: 'Unknown' }}
                          offerTitle={offersMap[b.offer_id]?.title ?? 'Session'}
                          role="provider"
                          onAccept={() => void handleAccept(b.id)}
                          onDecline={() => void handleDecline(b.id)}
                          actionLoading={actionLoading}
                        />
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'upcoming' && (
                  <div className="space-y-3">
                    {upcomingBookings.length === 0 ? (
                      <p className="py-8 text-center text-sm text-white/40">No upcoming sessions.</p>
                    ) : (
                      upcomingBookings.map((b) => (
                        <BookingRequestCard
                          key={b.id}
                          booking={b}
                          otherUser={buyersMap[b.buyer_id] ?? { gamertag: 'Unknown' }}
                          offerTitle={offersMap[b.offer_id]?.title ?? 'Session'}
                          role="provider"
                          onComplete={() => void handleComplete(b.id)}
                          actionLoading={actionLoading}
                        />
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'availability' && (
                  <AvailabilityEditor providerId={authUser.id} />
                )}

                {activeTab === 'history' && (
                  <div className="space-y-3">
                    {historyBookings.length === 0 ? (
                      <p className="py-8 text-center text-sm text-white/40">No booking history yet.</p>
                    ) : (
                      historyBookings.map((b) => (
                        <BookingRequestCard
                          key={b.id}
                          booking={b}
                          otherUser={buyersMap[b.buyer_id] ?? { gamertag: 'Unknown' }}
                          offerTitle={offersMap[b.offer_id]?.title ?? 'Session'}
                          role="provider"
                        />
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
