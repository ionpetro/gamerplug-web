'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, TABLES } from '@/lib/supabase';
import type { PayToPlayBookingStatus } from '@/lib/supabase';
import BookingRequestCard from '@/components/pay-to-play/BookingRequestCard';
import ReviewModal from '@/components/pay-to-play/ReviewModal';

interface Booking {
  id: string;
  offer_id: string;
  provider_id: string;
  status: PayToPlayBookingStatus;
  scheduled_start: string;
  scheduled_end: string;
  buyer_message?: string | null;
  total_price_cents: number;
  currency: string;
  created_at: string;
}

interface ProviderInfo {
  gamertag: string;
  profile_image_url?: string | null;
}

export default function BuyerBookingsPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { locale } = useI18n();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [providersMap, setProvidersMap] = useState<Record<string, ProviderInfo>>({});
  const [offersMap, setOffersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authUser?.id) return;
    const fetchBookings = async () => {
      setLoading(true);

      const { data: bookingsData, error } = await supabase
        .from(TABLES.PAY_TO_PLAY_BOOKINGS)
        .select('id,offer_id,provider_id,status,scheduled_start,scheduled_end,buyer_message,total_price_cents,currency,created_at')
        .eq('buyer_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading buyer bookings:', error);
        setLoading(false);
        return;
      }

      const bkgs = (bookingsData ?? []) as Booking[];
      setBookings(bkgs);

      // Batch fetch providers
      const providerIds = [...new Set(bkgs.map((b) => b.provider_id))];
      if (providerIds.length > 0) {
        const { data: users } = await supabase
          .from(TABLES.USERS)
          .select('id,gamertag,profile_image_url')
          .in('id', providerIds);
        const map: Record<string, ProviderInfo> = {};
        for (const u of users ?? []) {
          map[u.id] = { gamertag: u.gamertag, profile_image_url: u.profile_image_url };
        }
        setProvidersMap(map);
      }

      // Batch fetch offers
      const offerIds = [...new Set(bkgs.map((b) => b.offer_id))];
      if (offerIds.length > 0) {
        const { data: offers } = await supabase
          .from(TABLES.PAY_TO_PLAY_OFFERS)
          .select('id,title')
          .in('id', offerIds);
        const map: Record<string, string> = {};
        for (const o of offers ?? []) {
          map[o.id] = o.title ?? 'Session';
        }
        setOffersMap(map);
      }

      // Check which completed bookings have been reviewed
      const completedIds = bkgs.filter((b) => b.status === 'completed').map((b) => b.id);
      if (completedIds.length > 0) {
        const { data: reviews } = await supabase
          .from(TABLES.PAY_TO_PLAY_REVIEWS)
          .select('booking_id')
          .in('booking_id', completedIds)
          .eq('reviewer_id', authUser.id);
        setReviewedIds(new Set((reviews ?? []).map((r) => r.booking_id)));
      }

      setLoading(false);
    };
    void fetchBookings();
  }, [authUser?.id]);

  const handleCancel = async (bookingId: string) => {
    setActionLoading(true);
    const { error } = await supabase
      .from(TABLES.PAY_TO_PLAY_BOOKINGS)
      .update({ status: 'cancelled_by_buyer', cancelled_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (!error) {
      // Free availability slot
      await supabase
        .from(TABLES.PAY_TO_PLAY_AVAILABILITY_SLOTS)
        .update({ is_booked: false, booking_id: null })
        .eq('booking_id', bookingId);

      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled_by_buyer' as const } : b)));
    }
    setActionLoading(false);
  };

  const activeBookings = bookings
    .filter((b) => b.status === 'pending' || b.status === 'accepted')
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());

  const pastBookings = bookings
    .filter((b) => ['completed', 'declined', 'cancelled_by_buyer', 'cancelled_by_provider'].includes(b.status))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (authLoading) {
    return (
      <div className="relative flex-1 overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
        </div>
        <div className="relative container mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!authUser?.id) {
    router.push(`/${locale}/login?returnUrl=/${locale}/app/pay-to-play/bookings`);
    return null;
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-15%] h-[520px] w-[520px] rounded-full bg-primary/20 blur-[190px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/25 blur-[200px]" />
      </div>

      <div className="relative container mx-auto max-w-4xl px-6 py-8">
        <Link href={`/${locale}/app/pay-to-play`} className="mb-4 inline-flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold">
          <Calendar className="text-primary" />
          My Bookings
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/50">You haven&apos;t made any bookings yet.</p>
            <Link
              href={`/${locale}/app/pay-to-play`}
              className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Browse listings
            </Link>
          </div>
        ) : (
          <>
            {/* Active bookings */}
            {activeBookings.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">Active</h2>
                <div className="space-y-3">
                  {activeBookings.map((b) => (
                    <BookingRequestCard
                      key={b.id}
                      booking={b}
                      otherUser={providersMap[b.provider_id] ?? { gamertag: 'Unknown' }}
                      offerTitle={offersMap[b.offer_id] ?? 'Session'}
                      role="buyer"
                      onCancel={() => void handleCancel(b.id)}
                      actionLoading={actionLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">Past</h2>
                <div className="space-y-3">
                  {pastBookings.map((b) => (
                    <BookingRequestCard
                      key={b.id}
                      booking={b}
                      otherUser={providersMap[b.provider_id] ?? { gamertag: 'Unknown' }}
                      offerTitle={offersMap[b.offer_id] ?? 'Session'}
                      role="buyer"
                      onReview={
                        b.status === 'completed' && !reviewedIds.has(b.id)
                          ? () => setReviewBooking(b)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review modal */}
      {reviewBooking && (
        <ReviewModal
          bookingId={reviewBooking.id}
          providerId={reviewBooking.provider_id}
          reviewerId={authUser.id}
          onClose={() => setReviewBooking(null)}
          onSubmitted={() => {
            setReviewedIds((prev) => new Set([...prev, reviewBooking.id]));
            setReviewBooking(null);
          }}
        />
      )}
    </div>
  );
}
