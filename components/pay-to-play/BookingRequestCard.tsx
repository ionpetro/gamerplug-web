'use client';

import Image from 'next/image';
import { Calendar, Clock, MessageSquare } from 'lucide-react';
import type { PayToPlayBookingStatus } from '@/lib/supabase';
import BookingStatusBadge from './BookingStatusBadge';

interface BookingRequestCardProps {
  booking: {
    id: string;
    status: PayToPlayBookingStatus;
    scheduled_start: string;
    scheduled_end: string;
    buyer_message?: string | null;
    total_price_cents: number;
    currency: string;
    created_at: string;
  };
  otherUser: {
    gamertag: string;
    profile_image_url?: string | null;
  };
  offerTitle: string;
  role: 'provider' | 'buyer';
  onAccept?: () => void;
  onDecline?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onReview?: () => void;
  actionLoading?: boolean;
}

const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: (currency || 'USD').trim(),
    maximumFractionDigits: 0,
  }).format(cents / 100);

function formatDateTime(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function BookingRequestCard({
  booking,
  otherUser,
  offerTitle,
  role,
  onAccept,
  onDecline,
  onComplete,
  onCancel,
  onReview,
  actionLoading,
}: BookingRequestCardProps) {
  const isProvider = role === 'provider';
  const profileImg = otherUser.profile_image_url || '/logo-no-back.png';

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20">
      <div className="flex items-start gap-3">
        <Image
          src={profileImg}
          alt={otherUser.gamertag}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">@{otherUser.gamertag}</p>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-0.5 text-xs text-white/60">{offerTitle}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {formatDateTime(booking.scheduled_start)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {formatDateTime(booking.scheduled_end).split(' at ')[1]}
            </span>
            <span className="font-medium text-white">
              {formatPrice(booking.total_price_cents, booking.currency)}
            </span>
          </div>

          {booking.buyer_message && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-white/50">
              <MessageSquare size={12} className="mt-0.5 shrink-0" />
              <p className="line-clamp-2">{booking.buyer_message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {isProvider && booking.status === 'pending' && (
          <>
            <button
              onClick={onAccept}
              disabled={actionLoading}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/30 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={onDecline}
              disabled={actionLoading}
              className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/30 disabled:opacity-50"
            >
              Decline
            </button>
          </>
        )}

        {isProvider && booking.status === 'accepted' && (
          <button
            onClick={onComplete}
            disabled={actionLoading}
            className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/30 disabled:opacity-50"
          >
            Mark Complete
          </button>
        )}

        {!isProvider && (booking.status === 'pending' || booking.status === 'accepted') && (
          <button
            onClick={onCancel}
            disabled={actionLoading}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/20 disabled:opacity-50"
          >
            Cancel Booking
          </button>
        )}

        {!isProvider && booking.status === 'completed' && onReview && (
          <button
            onClick={onReview}
            disabled={actionLoading}
            className="rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/30 disabled:opacity-50"
          >
            Leave Review
          </button>
        )}
      </div>
    </div>
  );
}
