'use client';

import { Clock, Loader2 } from 'lucide-react';
import type { TimeSlot } from '@/lib/pay-to-play/availability';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  loading?: boolean;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function TimeSlotPicker({ slots, selectedSlot, onSelectSlot, loading }: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={18} className="animate-spin text-primary" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex items-center gap-2 py-4 text-xs text-white/50">
        <Clock size={14} />
        No available slots on this day
      </div>
    );
  }

  return (
    <div className="max-h-48 space-y-1.5 overflow-y-auto py-2">
      {slots.map((slot) => {
        const isSelected =
          selectedSlot?.starts_at.getTime() === slot.starts_at.getTime() &&
          selectedSlot?.ends_at.getTime() === slot.ends_at.getTime();

        return (
          <button
            key={slot.starts_at.toISOString()}
            onClick={() => onSelectSlot(slot)}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all ${
              isSelected
                ? 'border border-primary bg-primary/20 font-semibold text-white'
                : 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <Clock size={12} className="shrink-0" />
            {formatTime(slot.starts_at)} – {formatTime(slot.ends_at)}
          </button>
        );
      })}
    </div>
  );
}
