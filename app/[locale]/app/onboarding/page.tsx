'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, TABLES, Game } from '@/lib/supabase';
import { getGameAssetUrl } from '@/lib/assets';
import { getPlatformAssetUrl } from '@/lib/assets';
import { Loader2, ChevronLeft, ChevronRight, Check, Gamepad2, User, Calendar, Monitor, Video, PartyPopper } from 'lucide-react';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────

type Platform = 'PC' | 'PS5' | 'Xbox' | 'Nintendo Switch';

interface OnboardingData {
  selectedGames: Game[];
  gamertag: string;
  dateOfBirth: string;
  platforms: Platform[];
}

const STEPS = ['games', 'gamertag', 'age', 'platform', 'gameplay', 'complete'] as const;
type Step = typeof STEPS[number];

const STEP_LABELS: Record<Step, string> = {
  games: 'Games',
  gamertag: 'Gamertag',
  age: 'Age',
  platform: 'Platform',
  gameplay: 'Clips',
  complete: 'Done',
};

// ─── Generation quote helper ─────────────────────────────────────────────────

function getGenerationQuote(age: number): string {
  if (age >= 42) return '"All your base are belong to us." — Gen X';
  if (age >= 28) return '"The cake is a lie." — Millennial';
  if (age >= 17) return '"Just one more game..." — Gen Z';
  return '';
}

function calculateAge(dateString: string): number {
  const today = new Date();
  const birth = new Date(dateString);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < currentStep
                  ? 'bg-primary text-white'
                  : i === currentStep
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 sm:w-10 h-0.5 mx-1 transition-colors ${
                  i < currentStep ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-white/60 text-sm">
        {STEP_LABELS[STEPS[currentStep]]}
      </p>
    </div>
  );
}

// ─── Step 1: Game Selection ──────────────────────────────────────────────────

function GameSelectionStep({
  selectedGames,
  onSelect,
}: {
  selectedGames: Game[];
  onSelect: (games: Game[]) => void;
}) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      const { data, error } = await supabase
        .from(TABLES.GAMES)
        .select('*')
        .order('display_name', { ascending: true });

      if (!error && data) {
        setGames(data);
      }
      setLoading(false);
    }
    fetchGames();
  }, []);

  const toggleGame = (game: Game) => {
    const isSelected = selectedGames.some((g) => g.id === game.id);
    if (isSelected) {
      onSelect(selectedGames.filter((g) => g.id !== game.id));
    } else {
      onSelect([...selectedGames, game]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Gamepad2 className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">What do you play?</h2>
        <p className="text-white/60 mt-1">Select the games you play</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
        {games.map((game) => {
          const isSelected = selectedGames.some((g) => g.id === game.id);
          return (
            <button
              key={game.id}
              onClick={() => toggleGame(game)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <Image
                src={getGameAssetUrl(game.display_name)}
                alt={game.display_name}
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-xs text-white/80 text-center leading-tight">
                {game.display_name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Gamertag ────────────────────────────────────────────────────────

function GamertagStep({
  gamertag,
  onChange,
}: {
  gamertag: string;
  onChange: (value: string) => void;
}) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setAvailable(null);
      setError(null);
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`/api/username/check?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setAvailable(data.available);
      setError(data.error || null);
    } catch {
      setError('Failed to check availability');
    } finally {
      setChecking(false);
    }
  }, []);

  const handleChange = (value: string) => {
    onChange(value);
    setAvailable(null);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => checkAvailability(value), 500);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <User className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">Choose your gamertag</h2>
        <p className="text-white/60 mt-1">This is how other players will find you</p>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={gamertag}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter gamertag..."
          maxLength={30}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-primary transition-colors text-lg"
        />

        <div className="h-6 flex items-center gap-2 px-1">
          {checking && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white/40" />
              <span className="text-sm text-white/40">Checking...</span>
            </>
          )}
          {!checking && error && (
            <span className="text-sm text-red-400">{error}</span>
          )}
          {!checking && available === true && (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Available!</span>
            </>
          )}
          {!checking && available === false && !error && (
            <span className="text-sm text-red-400">This gamertag is taken</span>
          )}
        </div>
      </div>

      <p className="text-xs text-white/30 text-center">
        3-30 characters. Letters, numbers, hyphens, and underscores only.
      </p>
    </div>
  );
}

// ─── Step 3: Age ─────────────────────────────────────────────────────────────

function AgeStep({
  dateOfBirth,
  onChange,
}: {
  dateOfBirth: string;
  onChange: (value: string) => void;
}) {
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const tooYoung = age !== null && age < 17;
  const quote = age !== null && age >= 17 ? getGenerationQuote(age) : '';

  // Max date = 17 years ago from today
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 17);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <Calendar className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">When were you born?</h2>
        <p className="text-white/60 mt-1">You must be at least 17 years old</p>
      </div>

      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => onChange(e.target.value)}
        max={maxDateStr}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white focus:outline-none focus:border-primary transition-colors text-lg [color-scheme:dark]"
      />

      <div className="h-12 flex items-center justify-center">
        {tooYoung && (
          <p className="text-red-400 text-sm">You must be at least 17 years old to use GamerPlug.</p>
        )}
        {quote && (
          <p className="text-white/50 text-sm italic text-center">{quote}</p>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Platform ────────────────────────────────────────────────────────

const PLATFORMS: Platform[] = ['PC', 'PS5', 'Xbox', 'Nintendo Switch'];

function PlatformStep({
  platforms,
  onSelect,
}: {
  platforms: Platform[];
  onSelect: (platforms: Platform[]) => void;
}) {
  const toggle = (p: Platform) => {
    if (platforms.includes(p)) {
      onSelect(platforms.filter((x) => x !== p));
    } else {
      onSelect([...platforms, p]);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <Monitor className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">What do you play on?</h2>
        <p className="text-white/60 mt-1">Select all platforms you use</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map((platform) => {
          const isSelected = platforms.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => toggle(platform)}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <Image
                src={getPlatformAssetUrl(platform)}
                alt={platform}
                width={48}
                height={48}
              />
              <span className="text-sm text-white font-medium">{platform}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 5: Gameplay Clips (placeholder) ────────────────────────────────────

function GameplayStep() {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <Video className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">Show off your skills</h2>
        <p className="text-white/60 mt-1">Upload your best gameplay clips</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center"
          >
            <Video className="w-6 h-6 text-white/20" />
          </div>
        ))}
      </div>

      <p className="text-center text-white/40 text-sm">
        Clip uploads coming soon! You can add clips from your profile later.
      </p>
    </div>
  );
}

// ─── Step 6: Completion ──────────────────────────────────────────────────────

function CompletionStep({ data }: { data: OnboardingData }) {
  const age = data.dateOfBirth ? calculateAge(data.dateOfBirth) : null;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center">
        <PartyPopper className="w-12 h-12 text-primary mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white">You&apos;re all set!</h2>
        <p className="text-white/60 mt-1">Here&apos;s a summary of your profile</p>
      </div>

      <div className="space-y-4 bg-white/5 rounded-xl p-5 border border-white/10">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Gamertag</p>
          <p className="text-white font-bold text-lg font-space-mono">{data.gamertag}</p>
        </div>

        {age !== null && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Age</p>
            <p className="text-white">{age} years old</p>
          </div>
        )}

        {data.platforms.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Platforms</p>
            <div className="flex gap-2 flex-wrap">
              {data.platforms.map((p) => (
                <span key={p} className="px-2.5 py-1 bg-white/10 rounded-lg text-white text-sm">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.selectedGames.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Games</p>
            <div className="flex gap-2 flex-wrap">
              {data.selectedGames.map((g) => (
                <span key={g.id} className="px-2.5 py-1 bg-white/10 rounded-lg text-white text-sm">
                  {g.display_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Onboarding Page ────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { session, user, refreshUser } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    selectedGames: [],
    gamertag: '',
    dateOfBirth: '',
    platforms: [],
  });

  // If user already has a gamertag, redirect away
  useEffect(() => {
    if (user?.gamertag) {
      router.replace(`/en/app/profile/${user.gamertag}`);
    }
  }, [user, router]);

  const step = STEPS[currentStep];

  const canContinue = (): boolean => {
    switch (step) {
      case 'games':
        return data.selectedGames.length > 0;
      case 'gamertag':
        return data.gamertag.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(data.gamertag);
      case 'age':
        return data.dateOfBirth !== '' && calculateAge(data.dateOfBirth) >= 17;
      case 'platform':
        return data.platforms.length > 0;
      case 'gameplay':
        return true; // always skippable
      case 'complete':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!session?.user?.id) return;

    setSaving(true);
    try {
      const age = calculateAge(data.dateOfBirth);

      // Upsert user profile
      const { error: userError } = await supabase
        .from(TABLES.USERS)
        .upsert({
          id: session.user.id,
          gamertag: data.gamertag,
          age,
          platform: data.platforms,
          game_preferences: {},
        }, { onConflict: 'id' });

      if (userError) {
        console.error('Error saving user profile:', userError);
        alert('Failed to save your profile. Please try again.');
        setSaving(false);
        return;
      }

      // Insert selected games
      if (data.selectedGames.length > 0) {
        // Delete existing user_games first to avoid duplicates
        await supabase
          .from(TABLES.USER_GAMES)
          .delete()
          .eq('user_id', session.user.id);

        const userGames = data.selectedGames.map((game) => ({
          user_id: session.user.id,
          game_id: game.id,
        }));

        const { error: gamesError } = await supabase
          .from(TABLES.USER_GAMES)
          .insert(userGames);

        if (gamesError) {
          console.error('Error saving user games:', gamesError);
        }
      }

      // Refresh auth context to pick up the new profile
      await refreshUser();

      // Redirect to profile
      router.replace(`/en/app/profile/${data.gamertag}`);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      alert('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-8">
      <ProgressBar currentStep={currentStep} />

      <div className="w-full max-w-xl">
        {step === 'games' && (
          <GameSelectionStep
            selectedGames={data.selectedGames}
            onSelect={(games) => setData({ ...data, selectedGames: games })}
          />
        )}
        {step === 'gamertag' && (
          <GamertagStep
            gamertag={data.gamertag}
            onChange={(v) => setData({ ...data, gamertag: v })}
          />
        )}
        {step === 'age' && (
          <AgeStep
            dateOfBirth={data.dateOfBirth}
            onChange={(v) => setData({ ...data, dateOfBirth: v })}
          />
        )}
        {step === 'platform' && (
          <PlatformStep
            platforms={data.platforms}
            onSelect={(p) => setData({ ...data, platforms: p })}
          />
        )}
        {step === 'gameplay' && <GameplayStep />}
        {step === 'complete' && <CompletionStep data={data} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-10 w-full max-w-md">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <div className="flex-1" />

        {step === 'gameplay' && (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white transition-colors"
          >
            Skip
          </button>
        )}

        {step === 'complete' ? (
          <button
            onClick={handleComplete}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Let&apos;s go!
                <PartyPopper className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
