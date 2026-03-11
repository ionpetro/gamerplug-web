'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface MiniCalendarProps {
  selectedDate: string | null; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  availableDates: Set<string>;
  minDate?: Date;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function MiniCalendar({ selectedDate, onSelectDate, availableDates, minDate }: MiniCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const minDateStr = minDate
    ? toDateStr(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="px-1 py-2">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-white"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={nextMonth}
            className="rounded p-1 text-muted-foreground transition hover:bg-secondary hover:text-white"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {DAYS.map((d, i) => (
          <span key={i} className="text-[10px] font-medium text-muted-foreground">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = toDateStr(viewYear, viewMonth, day);
          const isSelected = dateStr === selectedDate;
          const hasAvailability = availableDates.has(dateStr);
          const isDisabled = dateStr < minDateStr;

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onSelectDate(dateStr)}
              disabled={isDisabled}
              className={`relative mx-auto mb-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs transition-all duration-200 ${
                isDisabled
                  ? 'cursor-not-allowed text-white/20'
                  : isSelected
                    ? 'bg-primary font-bold text-white'
                    : isToday(day)
                      ? 'bg-secondary font-semibold text-white ring-1 ring-primary/50'
                      : 'cursor-pointer text-white/70 hover:bg-secondary hover:text-white'
              }`}
            >
              {day}
              {hasAvailability && !isDisabled && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
