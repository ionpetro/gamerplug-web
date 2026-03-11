'use client';

import { useState } from 'react';
import { Loader2, Star, X } from 'lucide-react';
import { supabase, TABLES } from '@/lib/supabase';

interface ReviewModalProps {
  bookingId: string;
  providerId: string;
  reviewerId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReviewModal({ bookingId, providerId, reviewerId, onClose, onSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setSubmitting(true);
    setError('');

    const { error: insertError } = await supabase.from(TABLES.PAY_TO_PLAY_REVIEWS).insert({
      booking_id: bookingId,
      provider_id: providerId,
      reviewer_id: reviewerId,
      rating,
      comment: comment.trim() || null,
    });

    if (insertError) {
      setError(insertError.message || 'Failed to submit review.');
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <span className="font-bold text-white">Leave a Review</span>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground transition hover:bg-secondary hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Star selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoveredRating(n)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0.5 transition"
                >
                  <Star
                    size={28}
                    className={
                      n <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-white/20'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your session?"
              rows={3}
              className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleSubmit()}
            disabled={submitting || rating === 0}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}
