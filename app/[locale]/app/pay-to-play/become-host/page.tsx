'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Crown,
  DollarSign,
  Globe,
  Gamepad2,
  LayoutDashboard,
  Loader2,
  Play,
  Sparkles,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/components/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, TABLES } from '@/lib/supabase';
import Confetti from '@/components/pay-to-play/Confetti';

/* ── Constants ──────────────────────────────────────────────── */

const SERVICE_TYPES = [
  { value: 'coaching', label: 'Coaching', desc: 'Teach and improve their gameplay' },
  { value: 'duo_queue', label: 'Duo Queue', desc: 'Play ranked together' },
  { value: 'carry', label: 'Carry', desc: 'Carry them through tough content' },
  { value: 'team_session', label: 'Team Session', desc: 'Group play or scrims' },
  { value: 'live_stream', label: 'Live Stream Play', desc: 'Play live on stream with viewers' },
] as const;

const DURATIONS = [
  { value: '15', label: '15 min' },
  { value: '20', label: '20 min' },
  { value: '30', label: '30 min' },
  { value: '40', label: '40 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '150', label: '2.5 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TIME_OPTIONS: string[] = [];
for (let h = 6; h < 24; h++) {
  for (const m of [0, 30]) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}

function fmtTime(t: string) {
  const [h, mn] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${dh}:${String(mn).padStart(2, '0')} ${ap}`;
}

const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);

/* ── Types ──────────────────────────────────────────────────── */

interface AvailRule {
  active: boolean;
  startTime: string;
  endTime: string;
}

interface ClipItem {
  id: string;
  video_url: string;
  thumbnail_url?: string;
  title?: string;
  selected: boolean;
}

const STEP_LABELS = ['Listing', 'Pricing', 'Hours', 'Portfolio', 'Review'];

/* ── Component ──────────────────────────────────────────────── */

export default function BecomeHostPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { locale } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isExistingHost, setIsExistingHost] = useState<boolean | null>(null);

  // Step 0: Listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [games, setGames] = useState<string[]>([]);
  const [gameInput, setGameInput] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>(['coaching']);

  // Step 1: Pricing
  const [price, setPrice] = useState('10');
  const [durations, setDurations] = useState<string[]>(['60']);
  const [instantBook, setInstantBook] = useState(false);

  // Step 2: Availability
  const [rules, setRules] = useState<AvailRule[]>(
    Array.from({ length: 7 }, () => ({ active: false, startTime: '09:00', endTime: '17:00' }))
  );
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Step 3: Portfolio
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [clipsLoading, setClipsLoading] = useState(false);

  // Fetch clips when reaching step 3
  useEffect(() => {
    if (step !== 3 || !authUser?.id || clips.length > 0) return;
    const fetchClips = async () => {
      setClipsLoading(true);
      const { data } = await supabase
        .from(TABLES.CLIPS)
        .select('id,video_url,thumbnail_url,title')
        .eq('user_id', authUser.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      setClips(
        (data ?? []).map((c) => ({
          id: c.id,
          video_url: c.video_url,
          thumbnail_url: c.thumbnail_url,
          title: c.title,
          selected: true,
        }))
      );
      setClipsLoading(false);
    };
    void fetchClips();
  }, [step, authUser?.id]);

  // Check if user already has a profile
  useEffect(() => {
    if (!authUser?.id) return;
    const check = async () => {
      const { data } = await supabase
        .from(TABLES.PAY_TO_PLAY_PROFILES)
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle();
      setIsExistingHost(!!data);
    };
    void check();
  }, [authUser?.id]);

  const updateRule = (i: number, patch: Partial<AvailRule>) => {
    setRules((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const toggleClip = (id: string) => {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const moveClip = (index: number, dir: -1 | 1) => {
    setClips((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const canProceed = (s: number) => {
    if (s === 0) return title.trim().length > 0 && description.trim().length > 0 && serviceTypes.length > 0;
    if (s === 1) return Number(price) > 0 && durations.length > 0;
    if (s === 2) return rules.some((r) => r.active);
    return true;
  };

  const handleSubmit = async () => {
    if (!authUser?.id) return;
    setSubmitting(true);
    setError('');

    try {
      const priceCents = Math.round(Number(price) * 100);

      // 1. Create profile (inactive until reviewed)
      const { error: profileErr } = await supabase.from(TABLES.PAY_TO_PLAY_PROFILES).insert({
        user_id: authUser.id,
        headline: title.trim(),
        about: description.trim(),
        timezone,
        is_active: true,
        is_featured: false,
      });

      if (profileErr) {
        setError(profileErr.message || 'Failed to create profile.');
        setSubmitting(false);
        return;
      }

      // 2. Create offer (inactive until reviewed)
      const { data: offer, error: offerErr } = await supabase
        .from(TABLES.PAY_TO_PLAY_OFFERS)
        .insert({
          provider_id: authUser.id,
          title: title.trim(),
          description: description.trim(),
          service_type: serviceTypes.join(','),
          game_name: games.length > 0 ? games.join(', ') : 'Any Game',
          duration_minutes: Number(durations[0]),
          price_cents: priceCents,
          currency: 'USD',
          max_party_size: serviceTypes.includes('team_session') ? 4 : 1,
          instant_book: instantBook,
          booking_notice_hours: 24,
          cancellation_policy: 'flexible',
          location_type: 'online',
          is_active: true,
        })
        .select('id')
        .single();

      if (offerErr || !offer) {
        setError('Failed to create listing.');
        setSubmitting(false);
        return;
      }

      // 3. Save availability
      const activeRules = rules.map((r, i) => ({ ...r, day_of_week: i })).filter((r) => r.active);
      if (activeRules.length > 0) {
        await supabase.from(TABLES.PAY_TO_PLAY_AVAILABILITY).insert(
          activeRules.map((r) => ({
            provider_id: authUser.id,
            day_of_week: r.day_of_week,
            start_time: r.startTime,
            end_time: r.endTime,
            timezone,
            is_active: true,
          }))
        );
      }

      // 4. Save selected clips as listing media
      const selectedClips = clips.filter((c) => c.selected);
      if (selectedClips.length > 0) {
        await supabase.from(TABLES.PAY_TO_PLAY_LISTING_MEDIA).insert(
          selectedClips.map((c, i) => ({
            offer_id: offer.id,
            media_url: c.video_url,
            media_type: 'video' as const,
            sort_order: i,
            is_cover: i === 0,
          }))
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading / Auth guard ─────────────────────────────────── */

  if (authLoading || isExistingHost === null) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background py-20">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser?.id) {
    router.push(`/${locale}/login?returnUrl=/${locale}/app/pay-to-play/become-host`);
    return null;
  }

  /* ── Already a host ─────────────────────────────────────── */

  if (isExistingHost) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <Crown size={36} className="text-primary" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-bold">You&apos;re Already a Game Host!</h1>
          <p className="mb-6 text-white/60">
            You already have a listing. Head to your dashboard to manage your availability, bookings, and profile.
          </p>
          <Link
            href={`/${locale}/app/pay-to-play/dashboard`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            <LayoutDashboard size={16} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success screen ───────────────────────────────────────── */

  if (submitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-20 text-center">
        <Confetti />
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <Crown size={36} className="text-primary" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-bold">You&apos;re Live!</h1>
          <p className="mb-6 text-white/60">
            Your listing is now live and players can start booking sessions with you. Head to your dashboard to manage bookings and availability.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/app/pay-to-play/dashboard`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
            <Link
              href={`/${locale}/app/pay-to-play`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ─────────────────────────────────────────────────── */

  const selectedClipCount = clips.filter((c) => c.selected).length;

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Header */}
        <Link
          href={`/${locale}/app/pay-to-play`}
          className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <Crown className="text-primary" />
            Become a Game Host
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Set up your listing and start earning from gaming sessions.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center gap-1">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition ${
                  i < step
                    ? 'bg-primary text-white'
                    : i === step
                      ? 'border-2 border-primary bg-primary/20 text-primary'
                      : 'border border-white/15 text-white/25'
                }`}
              >
                {i < step ? '\u2713' : i + 1}
              </button>
              <span
                className={`hidden text-[11px] font-medium sm:inline ${
                  i <= step ? 'text-white/80' : 'text-white/25'
                }`}
              >
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`mx-0.5 h-px flex-1 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {/* ── Step 0: Listing ──────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Your Listing</h2>
                <p className="mt-1 text-sm text-white/40">What are you offering?</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Radiant Valorant Coach — VOD Review & Live Coaching"
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers what they'll get. Be specific — what ranks do you coach? What's your approach?"
                  rows={4}
                  className="w-full rounded-lg border border-white/15 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Games</label>
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/15 bg-black/20 px-3 py-2 focus-within:border-primary/50">
                  {games.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => setGames((prev) => prev.filter((x) => x !== g))}
                        className="ml-0.5 rounded-full p-0.5 transition hover:bg-primary/30"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={gameInput}
                    onChange={(e) => setGameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = gameInput.trim();
                        if (val && !games.includes(val)) {
                          setGames((prev) => [...prev, val]);
                        }
                        setGameInput('');
                      }
                      if (e.key === 'Backspace' && !gameInput && games.length > 0) {
                        setGames((prev) => prev.slice(0, -1));
                      }
                    }}
                    placeholder={games.length === 0 ? 'e.g. Valorant, Fortnite' : 'Add another...'}
                    className="min-w-[120px] flex-1 bg-transparent py-0.5 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>
                <p className="text-[10px] text-white/30">Press Enter or comma to add. Leave empty for &quot;Any Game&quot;</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Session Types</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICE_TYPES.map((st) => {
                    const checked = serviceTypes.includes(st.value);
                    return (
                      <label
                        key={st.value}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${
                          checked ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setServiceTypes((prev) =>
                              checked ? prev.filter((v) => v !== st.value) : [...prev, st.value]
                            )
                          }
                          className="mt-0.5 shrink-0 accent-primary"
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${checked ? 'text-white' : 'text-white/60'}`}>{st.label}</p>
                          <p className="text-[10px] text-white/30">{st.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Pricing ──────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Set Your Price</h2>
                <p className="mt-1 text-sm text-white/40">How much and how long per session?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Price (USD)</label>
                  <div className="flex items-center rounded-lg border border-white/15 bg-black/20 px-3">
                    <DollarSign size={14} className="shrink-0 text-white/40" />
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Session Times</label>
                  <div className="flex flex-wrap gap-1.5">
                    {DURATIONS.map((d) => {
                      const checked = durations.includes(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() =>
                            setDurations((prev) =>
                              checked ? prev.filter((v) => v !== d.value) : [...prev, d.value]
                            )
                          }
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                            checked
                              ? 'border-primary/40 bg-primary/15 text-primary'
                              : 'border-white/15 bg-black/20 text-white/50 hover:border-white/25'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20">
                <input
                  type="checkbox"
                  checked={instantBook}
                  onChange={(e) => setInstantBook(e.target.checked)}
                  className="accent-primary"
                />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                    <Zap size={14} className="text-primary" />
                    Instant Book
                  </p>
                  <p className="text-xs text-white/40">Buyers book immediately without waiting for approval</p>
                </div>
              </label>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs text-white/50">Session preview</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPrice(Math.round(Number(price) * 100))}
                  <span className="ml-1 text-sm font-normal text-white/50">
                    / {durations.map((d) => DURATIONS.find((x) => x.value === d)?.label).filter(Boolean).join(', ') || '—'}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2: Hours ────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Your Hours</h2>
                <p className="mt-1 text-sm text-white/40">When are you available for sessions?</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/40">
                <Globe size={12} />
                {timezone}
              </div>

              <div className="space-y-1.5">
                {DAY_NAMES.map((day, i) => {
                  const rule = rules[i];
                  return (
                    <div
                      key={day}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                        rule.active ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <label className="flex w-20 shrink-0 items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rule.active}
                          onChange={(e) => updateRule(i, { active: e.target.checked })}
                          className="accent-primary"
                        />
                        <span className={rule.active ? 'font-medium text-white' : 'text-white/40'}>
                          {day.slice(0, 3)}
                        </span>
                      </label>
                      {rule.active ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={rule.startTime}
                            onChange={(e) => updateRule(i, { startTime: e.target.value })}
                            className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs text-white outline-none"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{fmtTime(t)}</option>
                            ))}
                          </select>
                          <span className="text-xs text-white/40">to</span>
                          <select
                            value={rule.endTime}
                            onChange={(e) => updateRule(i, { endTime: e.target.value })}
                            className="rounded-lg border border-white/15 bg-black/30 px-2 py-1.5 text-xs text-white outline-none"
                          >
                            {TIME_OPTIONS.map((t) => (
                              <option key={t} value={t}>{fmtTime(t)}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              setRules((prev) =>
                                prev.map((r, idx) =>
                                  idx === i
                                    ? r
                                    : { ...r, active: true, startTime: rule.startTime, endTime: rule.endTime }
                                )
                              );
                            }}
                            className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 px-1.5 py-1 text-[10px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
                            title="Copy to all days"
                          >
                            <Copy size={10} />
                            All
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-white/25">Off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 3: Portfolio ─────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Your Portfolio</h2>
                <p className="mt-1 text-sm text-white/40">
                  Select and reorder your clips. These will show on your listing.
                </p>
              </div>

              {clipsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin text-primary" />
                </div>
              ) : clips.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-6 text-center">
                  <Play size={24} className="mx-auto mb-2 text-white/30" />
                  <p className="text-sm text-white/50">No clips found on your profile.</p>
                  <p className="mt-1 text-xs text-white/30">
                    Upload clips to your profile first, then come back here.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-white/50">
                    {selectedClipCount} of {clips.length} clips selected — drag to reorder
                  </p>
                  <div className="space-y-2">
                    {clips.map((clip, index) => (
                      <div
                        key={clip.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                          clip.selected
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-white/10 bg-white/[0.02] opacity-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={clip.selected}
                          onChange={() => toggleClip(clip.id)}
                          className="shrink-0 accent-primary"
                        />

                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-black/40">
                          {clip.thumbnail_url ? (
                            <Image
                              src={clip.thumbnail_url}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Play size={16} className="text-white/30" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white/80">
                            {clip.title || `Clip ${index + 1}`}
                          </p>
                          {clip.selected && (
                            <p className="text-[10px] text-primary">
                              #{clips.filter((c) => c.selected).indexOf(clip) + 1} in listing
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 flex-col gap-0.5">
                          <button
                            onClick={() => moveClip(index, -1)}
                            disabled={index === 0}
                            className="rounded p-0.5 text-white/30 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveClip(index, 1)}
                            disabled={index === clips.length - 1}
                            className="rounded p-0.5 text-white/30 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 4: Review ────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold">Review Your Listing</h2>
                <p className="mt-1 text-sm text-white/40">Make sure everything looks good before submitting.</p>
              </div>

              {/* Listing summary */}
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Listing</p>
                    <button onClick={() => setStep(0)} className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">{description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(games.length > 0 ? games : ['Any Game']).map((g) => (
                      <span key={g} className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-xs text-white/70">
                        <Gamepad2 size={11} />
                        {g}
                      </span>
                    ))}
                    {serviceTypes.map((st) => (
                      <span key={st} className="rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-xs text-white/70">
                        {SERVICE_TYPES.find((s) => s.value === st)?.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Pricing</p>
                    <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <DollarSign size={14} />
                      {formatPrice(Math.round(Number(price) * 100))}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/60">
                      <Timer size={14} />
                      {durations.map((d) => DURATIONS.find((x) => x.value === d)?.label).filter(Boolean).join(', ')}
                    </span>
                    {instantBook && (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Zap size={14} />
                        Instant Book
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Hours</p>
                    <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline">Edit</button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                    {DAY_NAMES.map((day, i) => {
                      const r = rules[i];
                      if (!r.active) return null;
                      return (
                        <span key={day}>
                          <span className="font-medium text-white/80">{day.slice(0, 3)}</span>{' '}
                          {fmtTime(r.startTime)}–{fmtTime(r.endTime)}
                        </span>
                      );
                    })}
                  </div>
                  <p className="mt-1 text-[10px] text-white/30">{timezone}</p>
                </div>

                {selectedClipCount > 0 && (
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Portfolio</p>
                      <button onClick={() => setStep(3)} className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                    <p className="text-xs text-white/60">{selectedClipCount} clips selected</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5"
            >
              Back
            </button>
          )}
          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed(step)}
              className={`${step > 0 ? 'flex-[2]' : 'w-full'} inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-40`}
            >
              Next
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="flex-[2] inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
