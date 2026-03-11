'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, DollarSign, Gamepad2, Globe, Loader2, Timer } from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, TABLES } from '@/lib/supabase';
import type { PayToPlayAvailability } from '@/lib/supabase';
import { generateAvailableSlots, getAvailableDates } from '@/lib/pay-to-play/availability';
import type { TimeSlot } from '@/lib/pay-to-play/availability';
import MiniCalendar from './MiniCalendar';
import TimeSlotPicker from './TimeSlotPicker';

interface BookingCardProps {
  offerId: string;
  providerId: string;
  providerGamertag: string;
  priceCents: number;
  currency: string;
  durationMinutes: number;
  bookingNoticeHours: number;
  instantBook: boolean;
}

const formatPrice = (priceCents: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').trim(),
    maximumFractionDigits: 0,
  }).format(priceCents / 100);

export default function BookingCard({
  offerId,
  providerId,
  providerGamertag,
  priceCents,
  currency,
  durationMinutes,
  bookingNoticeHours,
  instantBook,
}: BookingCardProps) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const { locale } = useI18n();

  const [availability, setAvailability] = useState<PayToPlayAvailability[]>([]);
  const [existingBookings, setExistingBookings] = useState<{ scheduled_start: string; scheduled_end: string }[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [buyerMessage, setBuyerMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Date range: today → 30 days out
  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }, []);

  // Fetch provider availability + existing bookings
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [availRes, bookingsRes] = await Promise.all([
          supabase
            .from(TABLES.PAY_TO_PLAY_AVAILABILITY)
            .select('id,provider_id,day_of_week,start_time,end_time,timezone,is_active,created_at,updated_at')
            .eq('provider_id', providerId)
            .eq('is_active', true),
          supabase
            .from(TABLES.PAY_TO_PLAY_BOOKINGS)
            .select('scheduled_start,scheduled_end')
            .eq('provider_id', providerId)
            .in('status', ['pending', 'accepted'])
            .gte('scheduled_end', new Date().toISOString()),
        ]);

        setAvailability((availRes.data as PayToPlayAvailability[]) ?? []);
        setExistingBookings(bookingsRes.data ?? []);
      } catch (err) {
        console.error('Error fetching availability:', err);
      } finally {
        setLoadingData(false);
      }
    };

    void fetchData();
  }, [providerId]);

  // Compute available dates for the calendar dots
  const availableDates = useMemo(
    () =>
      availability.length > 0
        ? getAvailableDates(availability, existingBookings, durationMinutes, bookingNoticeHours, startDate, endDate)
        : new Set<string>(),
    [availability, existingBookings, durationMinutes, bookingNoticeHours, startDate, endDate],
  );

  // Compute slots for the selected date
  const slotsForDate = useMemo(() => {
    if (!selectedDate || availability.length === 0) return [];
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dayStart = new Date(y, m - 1, d);
    const dayEnd = new Date(y, m - 1, d, 23, 59, 59);
    return generateAvailableSlots(availability, existingBookings, durationMinutes, bookingNoticeHours, dayStart, dayEnd);
  }, [selectedDate, availability, existingBookings, durationMinutes, bookingNoticeHours]);

  // Reset slot when date changes
  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setMessage(null);
  }, []);

  const handleBook = async () => {
    if (!authUser?.id) {
      router.push(`/${locale}/login?returnUrl=/${locale}/app/pay-to-play/${encodeURIComponent(providerGamertag)}`);
      return;
    }

    if (authUser.id === providerId) {
      setMessage({ type: 'error', text: 'You cannot book your own listing.' });
      return;
    }

    if (!selectedSlot) {
      setMessage({ type: 'error', text: 'Please select a time slot.' });
      return;
    }

    try {
      setBookingLoading(true);
      setMessage(null);

      const status = instantBook ? 'accepted' : 'pending';

      // Insert the booking
      const { data: booking, error: bookingError } = await supabase
        .from(TABLES.PAY_TO_PLAY_BOOKINGS)
        .insert({
          offer_id: offerId,
          provider_id: providerId,
          buyer_id: authUser.id,
          status,
          scheduled_start: selectedSlot.starts_at.toISOString(),
          scheduled_end: selectedSlot.ends_at.toISOString(),
          buyer_message: buyerMessage || null,
          total_price_cents: priceCents,
          currency,
          ...(instantBook ? { accepted_at: new Date().toISOString() } : {}),
        })
        .select('id')
        .single();

      if (bookingError) {
        setMessage({ type: 'error', text: bookingError.message || 'Failed to create booking.' });
        return;
      }

      // Record the availability slot as booked
      await supabase.from(TABLES.PAY_TO_PLAY_AVAILABILITY_SLOTS).insert({
        provider_id: providerId,
        offer_id: offerId,
        starts_at: selectedSlot.starts_at.toISOString(),
        ends_at: selectedSlot.ends_at.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_booked: true,
        booking_id: booking.id,
      });

      // Update local state to remove the booked slot
      setExistingBookings((prev) => [
        ...prev,
        { scheduled_start: selectedSlot.starts_at.toISOString(), scheduled_end: selectedSlot.ends_at.toISOString() },
      ]);
      setSelectedSlot(null);

      const successMsg = instantBook
        ? `Booking confirmed with @${providerGamertag}!`
        : `Booking request sent to @${providerGamertag}.`;
      setMessage({ type: 'success', text: successMsg });
    } catch (err) {
      console.error('Booking error:', err);
      setMessage({ type: 'error', text: 'Unexpected error creating booking.' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/10 bg-card p-4 shadow-xl">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-lg font-bold">{formatPrice(priceCents, currency)}</p>
          <span className="text-sm text-white/60">per session</span>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : availability.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-center text-xs text-white/50">
            This host hasn&apos;t set their availability yet.
          </div>
        ) : (
          <>
            <MiniCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              availableDates={availableDates}
              minDate={startDate}
            />

            {selectedDate && (
              <TimeSlotPicker
                slots={slotsForDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            )}
          </>
        )}

        {selectedSlot && (
          <textarea
            value={buyerMessage}
            onChange={(e) => setBuyerMessage(e.target.value)}
            placeholder="Add a message for the host (optional)"
            rows={2}
            className="mt-3 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-primary/50"
          />
        )}

        <button
          onClick={() => void handleBook()}
          disabled={bookingLoading || !selectedSlot}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bookingLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Gamepad2 size={16} />
          )}
          {instantBook ? 'Book Now' : 'Book'}
        </button>

        {message && (
          <p
            className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
              message.type === 'success'
                ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-1 text-[10px] text-white/40">
        <Globe size={10} />
        Times shown in your local time
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-white/15 bg-white/5 p-3">
          <p className="mb-1 inline-flex items-center gap-1 text-white/50">
            <DollarSign size={12} />
            Price
          </p>
          <p className="font-semibold">{formatPrice(priceCents, currency)}</p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/5 p-3">
          <p className="mb-1 inline-flex items-center gap-1 text-white/50">
            <Timer size={12} />
            Duration
          </p>
          <p className="font-semibold">{durationMinutes} min</p>
        </div>
      </div>
    </div>
  );
}
