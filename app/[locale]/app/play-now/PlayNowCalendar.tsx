'use client';

/**
 * ─────────────────────────────────────────────
 *  PlayNowCalendar — Booking sidebar
 *  Dummy UI. To remove: delete this file and
 *  remove the <PlayNowCalendar /> import + usage
 *  from page.tsx (search "CALENDAR PANEL").
 * ─────────────────────────────────────────────
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar, Clock, Gamepad2 } from '@/lib/icons';

// ── Types ────────────────────────────────────────────────────────────────────

type SlotStatus = 'available' | 'booked' | 'mine';

interface Slot {
  hour: number;
  label: string;
  status: SlotStatus;
  title?: string;
}

// ── Dummy data ────────────────────────────────────────────────────────────────

const DUMMY_SLOTS: Slot[] = [
  { hour: 8,  label: '8 AM',  status: 'available' },
  { hour: 9,  label: '9 AM',  status: 'mine',   title: 'My Session – Valorant' },
  { hour: 10, label: '10 AM', status: 'booked', title: 'CoachFrosty' },
  { hour: 11, label: '11 AM', status: 'available' },
  { hour: 12, label: '12 PM', status: 'available' },
  { hour: 13, label: '1 PM',  status: 'booked', title: 'DrBear' },
  { hour: 14, label: '2 PM',  status: 'available' },
  { hour: 15, label: '3 PM',  status: 'mine',   title: 'My Session – Apex' },
  { hour: 16, label: '4 PM',  status: 'available' },
  { hour: 17, label: '5 PM',  status: 'booked', title: 'Warezzly' },
  { hour: 18, label: '6 PM',  status: 'available' },
  { hour: 19, label: '7 PM',  status: 'available' },
  { hour: 20, label: '8 PM',  status: 'booked', title: 'Sticky' },
  { hour: 21, label: '9 PM',  status: 'available' },
  { hour: 22, label: '10 PM', status: 'available' },
];

const DUMMY_GAMES = [
  'Apex Legends', 'Valorant', 'Call of Duty', 'Fortnite',
  'League of Legends', 'Overwatch 2', 'Rocket League', 'Marvel Rivals',
];

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const SLOT_STYLES: Record<SlotStatus, string> = {
  available: 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 cursor-pointer',
  booked:    'bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed',
  mine:      'bg-primary/25 text-white border border-primary/60 cursor-pointer',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ── Create Event Modal ────────────────────────────────────────────────────────

function CreateEventModal({
  slot,
  date,
  onClose,
}: {
  slot: Slot;
  date: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [game, setGame] = useState(DUMMY_GAMES[0]);
  const [duration, setDuration] = useState('1');

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span className="font-bold text-white">Create Event</span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal body */}
        <div className="space-y-5 px-6 py-5">
          {/* Date + time (read-only) */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 px-4 py-3">
            <Clock size={15} className="flex-shrink-0 text-primary" />
            <span className="text-sm text-white/80">
              {date} &mdash; {slot.label}
            </span>
          </div>

          {/* Event title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Event Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ranked grind session"
              className="w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-primary/60"
            />
          </div>

          {/* Game picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Game
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-4 py-2.5">
              <Gamepad2 size={15} className="flex-shrink-0 text-muted-foreground" />
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              >
                {DUMMY_GAMES.map((g) => (
                  <option key={g} value={g} className="bg-card text-white">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Duration
            </label>
            <div className="flex gap-2">
              {['1', '2', '3'].map((h) => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm font-medium transition-all duration-300 ${
                    duration === h
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-white'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:opacity-90"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PlayNowCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  const selectedDate = new Date(viewYear, viewMonth, selectedDay);
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <>
      <aside className="hidden w-72 flex-shrink-0 flex-col border-l border-border bg-card lg:flex">
        {/* Header */}
        <div className="flex h-12 flex-shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Play Calendar
          </span>
          <span className="text-xs font-semibold text-white">{formattedDate}</span>
        </div>

        {/* Mini month calendar */}
        <div className="flex-shrink-0 border-b border-border px-4 py-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="cursor-pointer rounded p-1 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextMonth}
                className="cursor-pointer rounded p-1 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-white"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map((d, i) => (
              <span key={i} className="text-[10px] font-medium text-muted-foreground">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center">
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`mx-auto mb-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-xs transition-all duration-200 ${
                    isToday(day)
                      ? 'bg-primary font-bold text-white'
                      : selected
                      ? 'bg-secondary font-semibold text-white ring-1 ring-primary/50'
                      : 'text-white/70 hover:bg-secondary hover:text-white'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Available Slots
          </p>
          <div className="space-y-1.5">
            {DUMMY_SLOTS.map((slot) => (
              <div
                key={slot.hour}
                onClick={() => slot.status === 'available' && setBookingSlot(slot)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all duration-300 ${SLOT_STYLES[slot.status]}`}
              >
                <span className="w-12 flex-shrink-0 font-medium">{slot.label}</span>

                {slot.status === 'available' ? (
                  <span className="font-semibold text-primary">+ Create Event</span>
                ) : (
                  <span className="truncate">
                    {slot.status === 'mine' ? '★ ' : ''}
                    {slot.title}
                  </span>
                )}

                <span
                  className={`ml-auto flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    slot.status === 'mine'
                      ? 'bg-primary/30 text-primary'
                      : slot.status === 'booked'
                      ? 'bg-white/10 text-white/40'
                      : 'text-primary/70'
                  }`}
                >
                  {slot.status === 'mine' ? 'Yours' : slot.status === 'booked' ? 'Full' : 'Open'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Create Event modal */}
      {bookingSlot && (
        <CreateEventModal
          slot={bookingSlot}
          date={formattedDate}
          onClose={() => setBookingSlot(null)}
        />
      )}
    </>
  );
}
