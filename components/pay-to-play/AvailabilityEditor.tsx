'use client';

import { useEffect, useState } from 'react';
import { Copy, Globe, Loader2, Save } from 'lucide-react';
import { supabase, TABLES } from '@/lib/supabase';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Generate time options in 30-min increments from 6:00 AM to 11:30 PM
const TIME_OPTIONS: string[] = [];
for (let h = 6; h < 24; h++) {
  for (const m of [0, 30]) {
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    TIME_OPTIONS.push(`${hh}:${mm}`);
  }
}

function formatTimeLabel(time: string) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
}

interface DayRule {
  active: boolean;
  startTime: string;
  endTime: string;
  existingId?: string; // DB row id for upserts
}

interface AvailabilityEditorProps {
  providerId: string;
}

export default function AvailabilityEditor({ providerId }: AvailabilityEditorProps) {
  const [rules, setRules] = useState<DayRule[]>(
    DAY_NAMES.map(() => ({ active: false, startTime: '09:00', endTime: '17:00' }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLES.PAY_TO_PLAY_AVAILABILITY)
        .select('id,day_of_week,start_time,end_time,is_active')
        .eq('provider_id', providerId);

      if (error) {
        console.error('Error loading availability:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const updated = [...rules];
        for (const row of data) {
          updated[row.day_of_week] = {
            active: row.is_active,
            startTime: row.start_time,
            endTime: row.end_time,
            existingId: row.id,
          };
        }
        setRules(updated);
      }
      setLoading(false);
    };

    void fetchAvailability();
  }, [providerId]);

  const updateRule = (dayIndex: number, patch: Partial<DayRule>) => {
    setRules((prev) => prev.map((r, i) => (i === dayIndex ? { ...r, ...patch } : r)));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      for (let day = 0; day < 7; day++) {
        const rule = rules[day];
        const row = {
          provider_id: providerId,
          day_of_week: day,
          start_time: rule.startTime,
          end_time: rule.endTime,
          timezone,
          is_active: rule.active,
        };

        if (rule.existingId) {
          const { error } = await supabase
            .from(TABLES.PAY_TO_PLAY_AVAILABILITY)
            .update(row)
            .eq('id', rule.existingId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from(TABLES.PAY_TO_PLAY_AVAILABILITY)
            .insert(row)
            .select('id')
            .single();
          if (error) throw error;
          if (data) updateRule(day, { existingId: data.id });
        }
      }
      setMessage({ type: 'success', text: 'Availability saved.' });
    } catch (err: unknown) {
      console.error('Error saving availability:', err);
      setMessage({ type: 'error', text: 'Failed to save availability.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-white/50">
        <Globe size={12} />
        Timezone: {timezone}
      </div>

      <div className="space-y-2">
        {DAY_NAMES.map((day, index) => {
          const rule = rules[index];
          return (
            <div
              key={day}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                rule.active ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <label className="flex w-24 shrink-0 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rule.active}
                  onChange={(e) => updateRule(index, { active: e.target.checked })}
                  className="accent-primary"
                />
                <span className={rule.active ? 'font-medium text-white' : 'text-white/50'}>{day.slice(0, 3)}</span>
              </label>

              {rule.active ? (
                <div className="flex items-center gap-2">
                  <select
                    value={rule.startTime}
                    onChange={(e) => updateRule(index, { startTime: e.target.value })}
                    className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs text-white outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{formatTimeLabel(t)}</option>
                    ))}
                  </select>
                  <span className="text-xs text-white/40">to</span>
                  <select
                    value={rule.endTime}
                    onChange={(e) => updateRule(index, { endTime: e.target.value })}
                    className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs text-white outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>{formatTimeLabel(t)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setRules((prev) =>
                        prev.map((r, i) =>
                          i === index ? r : { ...r, active: true, startTime: rule.startTime, endTime: rule.endTime }
                        )
                      );
                    }}
                    className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 px-1.5 py-1 text-[10px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
                    title="Copy these hours to all days"
                  >
                    <Copy size={10} />
                    Copy to all
                  </button>
                </div>
              ) : (
                <span className="text-xs text-white/30">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => void handleSave()}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Save Availability
      </button>

      {message && (
        <p
          className={`rounded-xl border px-3 py-2 text-sm ${
            message.type === 'success'
              ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-400/30 bg-rose-500/10 text-rose-200'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
