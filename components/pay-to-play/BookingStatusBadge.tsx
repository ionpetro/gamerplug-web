'use client';

import type { PayToPlayBookingStatus } from '@/lib/supabase';

const STATUS_STYLES: Record<PayToPlayBookingStatus, string> = {
  pending: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
  accepted: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
  declined: 'border-rose-400/30 bg-rose-500/10 text-rose-300',
  cancelled_by_buyer: 'border-white/15 bg-white/5 text-white/50',
  cancelled_by_provider: 'border-white/15 bg-white/5 text-white/50',
  completed: 'border-primary/30 bg-primary/10 text-primary',
};

const STATUS_LABELS: Record<PayToPlayBookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  cancelled_by_buyer: 'Cancelled',
  cancelled_by_provider: 'Cancelled',
  completed: 'Completed',
};

export default function BookingStatusBadge({ status }: { status: PayToPlayBookingStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
