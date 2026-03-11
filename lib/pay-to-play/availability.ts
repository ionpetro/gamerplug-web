import type { PayToPlayAvailability } from '@/lib/supabase';

export interface TimeSlot {
  starts_at: Date;
  ends_at: Date;
}

/**
 * Convert a wall-clock time string (e.g. "09:00") on a given date
 * in a specific timezone to a UTC Date.
 */
export function timeInTimezone(date: Date, timeStr: string, timezone: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // Create a date in UTC, then find the offset for the target timezone
  // by comparing the formatted date parts
  const tentative = new Date(Date.UTC(year, month, day, hours, minutes, 0));

  // Get the timezone offset by formatting and parsing
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Find what "tentative" looks like in the target timezone
  const parts = formatter.formatToParts(tentative);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const tzHour = get('hour') === 24 ? 0 : get('hour');
  const tzMinute = get('minute');

  // Diff tells us how the timezone shifts from UTC
  const diffMinutes = (tzHour * 60 + tzMinute) - (hours * 60 + minutes);

  // Subtract the diff to get the correct UTC time
  return new Date(tentative.getTime() - diffMinutes * 60 * 1000);
}

/**
 * Generate non-overlapping bookable time slots for a date range.
 */
export function generateAvailableSlots(
  availability: Pick<PayToPlayAvailability, 'day_of_week' | 'start_time' | 'end_time' | 'timezone' | 'is_active'>[],
  existingBookings: { scheduled_start: string; scheduled_end: string }[],
  durationMinutes: number,
  bookingNoticeHours: number,
  startDate: Date,
  endDate: Date,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();
  const noticeThreshold = new Date(now.getTime() + bookingNoticeHours * 60 * 60 * 1000);

  // Pre-parse existing bookings for overlap checks
  const bookedRanges = existingBookings.map((b) => ({
    start: new Date(b.scheduled_start).getTime(),
    end: new Date(b.scheduled_end).getTime(),
  }));

  const activeRules = availability.filter((a) => a.is_active);

  // Iterate each date in range
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0=Sun

    // Find availability rules for this day
    const rules = activeRules.filter((a) => a.day_of_week === dayOfWeek);

    for (const rule of rules) {
      const windowStart = timeInTimezone(current, rule.start_time, rule.timezone);
      const windowEnd = timeInTimezone(current, rule.end_time, rule.timezone);

      // Generate slots within this window
      let slotStart = new Date(windowStart);
      while (slotStart.getTime() + durationMinutes * 60 * 1000 <= windowEnd.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

        // Filter: not in the past
        if (slotStart > now) {
          // Filter: respects booking notice
          if (slotStart >= noticeThreshold) {
            // Filter: no overlap with existing bookings
            const slotStartMs = slotStart.getTime();
            const slotEndMs = slotEnd.getTime();
            const overlaps = bookedRanges.some(
              (b) => slotStartMs < b.end && slotEndMs > b.start
            );

            if (!overlaps) {
              slots.push({ starts_at: new Date(slotStart), ends_at: new Date(slotEnd) });
            }
          }
        }

        // Move to next slot
        slotStart = new Date(slotEnd);
      }
    }

    // Next day
    current.setDate(current.getDate() + 1);
  }

  return slots;
}

/**
 * Lighter version: returns a Set of YYYY-MM-DD date strings that have at least one open slot.
 */
export function getAvailableDates(
  availability: Pick<PayToPlayAvailability, 'day_of_week' | 'start_time' | 'end_time' | 'timezone' | 'is_active'>[],
  existingBookings: { scheduled_start: string; scheduled_end: string }[],
  durationMinutes: number,
  bookingNoticeHours: number,
  startDate: Date,
  endDate: Date,
): Set<string> {
  const slots = generateAvailableSlots(
    availability,
    existingBookings,
    durationMinutes,
    bookingNoticeHours,
    startDate,
    endDate,
  );

  const dates = new Set<string>();
  for (const slot of slots) {
    // Format in local time
    const y = slot.starts_at.getFullYear();
    const m = String(slot.starts_at.getMonth() + 1).padStart(2, '0');
    const d = String(slot.starts_at.getDate()).padStart(2, '0');
    dates.add(`${y}-${m}-${d}`);
  }
  return dates;
}
