'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, type PanInfo } from 'framer-motion';
import { supabase, User, Clip, TABLES } from '@/lib/supabase';
import { clearLeftSwipes, swipeUser } from '@/lib/swipes';
import { useAuth } from '@/contexts/AuthContext';
import posthog from 'posthog-js';
import {
  Heart,
  Loader2,
  Users,
  Volume2,
  VolumeOff,
  X,
} from 'lucide-react';

interface ClipWithProcessing extends Clip {
  video_processing?:
    | { processed_video_url?: string; status?: string }
    | Array<{ processed_video_url?: string; status?: string }>;
}

interface ReferrerProfile {
  id: string;
  gamertag: string;
  profile_image_url?: string | null;
}

interface UserWithClips extends User {
  clips: ClipWithProcessing[];
  referrer?: ReferrerProfile | null;
}

type SwipeDirection = 'left' | 'right';

const SWIPE_THRESHOLD = 120;
const SWIPE_VELOCITY_THRESHOLD = 650;
const SLOT_COUNT = 3;
const SLOT_EMPTY = { x: 0, y: 0, rotate: 0 };

function getUserClips(user: UserWithClips | undefined) {
  if (!user) return [] as ClipWithProcessing[];
  return (user.clips || []).filter((clip): clip is ClipWithProcessing => Boolean(getPlayableVideoUrl(clip)));
}

function getPlayableVideoUrl(clip: ClipWithProcessing | null) {
  if (!clip) return '';
  const processing = Array.isArray(clip.video_processing)
    ? clip.video_processing[0]
    : clip.video_processing;

  if (processing?.status === 'completed' && processing.processed_video_url) {
    return processing.processed_video_url;
  }

  return clip.video_url;
}

export default function ExplorePage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const { user: authUser } = useAuth();

  const [users, setUsers] = useState<UserWithClips[]>([]);
  const [clipsByUser, setClipsByUser] = useState<Record<string, ClipWithProcessing[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clipIndices, setClipIndices] = useState<Record<string, number>>({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isSwipeCommitted, setIsSwipeCommitted] = useState(false);
  const [currentDragX, setCurrentDragX] = useState(0);
  const [slotTransforms, setSlotTransforms] = useState(
    Array.from({ length: SLOT_COUNT }, () => ({ ...SLOT_EMPTY }))
  );
  const [screenWidth, setScreenWidth] = useState(430);
  const [clipOrientations, setClipOrientations] = useState<Record<string, 'portrait' | 'landscape' | 'square'>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserWithClips | null>(null);
  const [isRefreshingDiscovery, setIsRefreshingDiscovery] = useState(false);
  const seenUserIds = useRef(new Set<string>());
  const PAGE_SIZE = 20;

  const currentUser = users[currentIndex];
  const currentClips = currentUser
    ? clipsByUser[currentUser.id] || getUserClips(currentUser)
    : [];

  useEffect(() => {
    const syncWidth = () => setScreenWidth(window.innerWidth || 430);
    syncWidth();
    window.addEventListener('resize', syncWidth);
    return () => window.removeEventListener('resize', syncWidth);
  }, []);

  const setSlotTransform = useCallback(
    (slotIndex: number, transform: { x: number; y: number; rotate: number }) => {
      setSlotTransforms((prev) =>
        prev.map((slot, index) => (index === slotIndex ? transform : slot))
      );
    },
    []
  );

  const fetchUsers = useCallback(async (isInitial: boolean) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      // Exclude users already swiped on (persisted in DB) + session-seen users
      let swipedIds: string[] = [];
      if (authUser?.id) {
        const { data: swipedData } = await supabase
          .from(TABLES.SWIPES)
          .select('to_user_id')
          .eq('from_user_id', authUser.id);
        swipedIds = swipedData?.map((s: { to_user_id: string }) => s.to_user_id) || [];
      }

      const excludeIds = [
        ...(authUser?.id ? [authUser.id] : []),
        ...swipedIds,
        ...Array.from(seenUserIds.current),
      ];

      let query = supabase
        .from(TABLES.USERS)
        .select(
          `
          *,
          referrer:users!users_referred_by_user_id_fkey (
            id,
            gamertag,
            profile_image_url
          ),
          clips!inner (
            *,
            video_processing (
              processed_video_url,
              status
            )
          )
        `
        )
        .eq('clips.is_public', true)
        .not('gamertag', 'is', null)
        .neq('gamertag', 'Temporary User')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data: usersData, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (!usersData || usersData.length < PAGE_SIZE) {
        setHasMore(false);
      }

      const usersWithPlayableClips = (usersData || [])
        .filter((user) => !seenUserIds.current.has(user.id))
        .map((user) => {
          const playableClips = getUserClips(user as UserWithClips)
            .slice()
            .sort((a, b) => {
              const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
              const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
              return bTime - aTime;
            })
            .slice(0, 5) as ClipWithProcessing[];

          return {
            ...(user as UserWithClips),
            clips: playableClips,
          };
        })
        .filter((user) => user.clips.length > 0);

      for (const user of usersWithPlayableClips) {
        seenUserIds.current.add(user.id);
      }

      const clipsData: Record<string, ClipWithProcessing[]> = usersWithPlayableClips.reduce(
        (acc, user) => {
          acc[user.id] = user.clips;
          return acc;
        },
        {} as Record<string, ClipWithProcessing[]>
      );

      if (isInitial) {
        setUsers(usersWithPlayableClips);
        setClipsByUser(clipsData);
        setCurrentIndex(0);
        setClipIndices({});
        setIsProfileOpen(false);
        setIsSwiping(false);
        setIsSwipeCommitted(false);
        setCurrentDragX(0);
        setSlotTransforms(Array.from({ length: SLOT_COUNT }, () => ({ ...SLOT_EMPTY })));
      } else {
        setUsers((prev) => [...prev, ...usersWithPlayableClips]);
        setClipsByUser((prev) => ({ ...prev, ...clipsData }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    seenUserIds.current.clear();
    fetchUsers(true);
  }, [fetchUsers]);

  // Infinite load: fetch more when within 5 cards of the end
  useEffect(() => {
    if (loadingMore || !hasMore || loading) return;
    const remaining = users.length - currentIndex;
    if (remaining <= 5) {
      fetchUsers(false);
    }
  }, [currentIndex, users.length, hasMore, loadingMore, loading, fetchUsers]);

  const commitSwipe = useCallback(
    (direction: SwipeDirection, slotIndex: number) => {
      if (!currentUser || isSwipeCommitted) return;

      // Capture the swiped user before state changes
      const swipedUser = currentUser;

      setIsSwiping(true);
      setIsSwipeCommitted(true);
      setCurrentDragX(direction === 'right' ? screenWidth : -screenWidth);

      setSlotTransform(slotIndex, {
        x: direction === 'right' ? screenWidth + 120 : -screenWidth - 120,
        y: 0,
        rotate: direction === 'right' ? 14 : -14,
      });

      const nextIndex = currentIndex + 1;
      const slotToReset = (currentIndex + 2) % SLOT_COUNT;

      // Persist swipe to DB (fire-and-forget for left; check match for right)
      if (authUser?.id) {
        if (direction === 'right') {
          posthog.capture('user_swiped_right', { target_gamertag: swipedUser.gamertag });
        } else {
          posthog.capture('user_swiped_left', { target_gamertag: swipedUser.gamertag });
        }
        swipeUser(authUser.id, swipedUser.id, direction).then((result) => {
          if (result.isMatch) {
            posthog.capture('match_occurred', { matched_gamertag: swipedUser.gamertag });
            setMatchedUser(swipedUser);
            setShowMatchModal(true);
          }
        });
      }

      window.setTimeout(() => {
        setSlotTransform(slotToReset, { ...SLOT_EMPTY });
        setCurrentIndex(nextIndex);
        setIsSwiping(false);
        setIsSwipeCommitted(false);
        setCurrentDragX(0);
        setIsProfileOpen(false);
      }, 220);
    },
    [authUser?.id, currentIndex, currentUser, isSwipeCommitted, screenWidth, setSlotTransform]
  );

  const onCardDrag = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 5) setIsSwiping(true);
    setCurrentDragX(info.offset.x);

    const slotIndex = currentIndex % SLOT_COUNT;
    const tilt = Math.max(-12, Math.min(12, info.offset.x / 16));

    setSlotTransforms((prev) =>
      prev.map((slot, index) => (index === slotIndex ? { ...slot, rotate: tilt } : slot))
    );
  }, [currentIndex]);

  const onCardDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, slotIndex: number) => {
      if (!currentUser || isSwipeCommitted) return;

      const projectedX = info.offset.x + info.velocity.x * 0.22;
      const shouldSwipeRight =
        projectedX > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD;
      const shouldSwipeLeft =
        projectedX < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD;

      if (shouldSwipeRight) {
        commitSwipe('right', slotIndex);
        return;
      }

      if (shouldSwipeLeft) {
        commitSwipe('left', slotIndex);
        return;
      }

      setIsSwiping(false);
      setCurrentDragX(0);
      setSlotTransform(slotIndex, { ...SLOT_EMPTY });
    },
    [commitSwipe, currentUser, isSwipeCommitted, setSlotTransform]
  );

  const goToNextPhoto = useCallback(() => {
    if (!currentUser || currentClips.length <= 1) return;

    setClipIndices((prev) => {
      const current = prev[currentUser.id] ?? 0;
      const next = (current + 1) % currentClips.length;
      return { ...prev, [currentUser.id]: next };
    });
  }, [currentClips.length, currentUser]);

  const goToPrevPhoto = useCallback(() => {
    if (!currentUser || currentClips.length <= 1) return;

    setClipIndices((prev) => {
      const current = prev[currentUser.id] ?? 0;
      const prev_ = (current - 1 + currentClips.length) % currentClips.length;
      return { ...prev, [currentUser.id]: prev_ };
    });
  }, [currentClips.length, currentUser]);

  const goToNextClipForUser = useCallback((userId: string, totalClips: number) => {
    if (totalClips <= 1) return;
    setClipIndices((prev) => {
      const current = prev[userId] ?? 0;
      return { ...prev, [userId]: (current + 1) % totalClips };
    });
  }, []);

  const goToPrevClipForUser = useCallback((userId: string, totalClips: number) => {
    if (totalClips <= 1) return;
    setClipIndices((prev) => {
      const current = prev[userId] ?? 0;
      return { ...prev, [userId]: (current - 1 + totalClips) % totalClips };
    });
  }, []);

  const handleNope = useCallback(() => {
    commitSwipe('left', currentIndex % SLOT_COUNT);
  }, [commitSwipe, currentIndex]);

  const handleLike = useCallback(() => {
    commitSwipe('right', currentIndex % SLOT_COUNT);
  }, [commitSwipe, currentIndex]);

  const handleOpenProfile = useCallback(() => {
    setIsProfileOpen(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const handleRefreshDiscovery = useCallback(async () => {
    if (!authUser?.id || isRefreshingDiscovery) return;

    const shouldRefresh = window.confirm(
      'Refresh Discovery?\n\nGive anyone you swiped left on, a second chance.'
    );

    if (!shouldRefresh) return;

    setIsRefreshingDiscovery(true);
    try {
      const result = await clearLeftSwipes(authUser.id);
      if (!result.success) {
        window.alert('Could not refresh discovery. Please try again.');
        return;
      }

      seenUserIds.current.clear();
      setHasMore(true);
      await fetchUsers(true);
    } catch (error) {
      console.error('Refresh discovery error:', error);
      window.alert('Could not refresh discovery. Please try again.');
    } finally {
      setIsRefreshingDiscovery(false);
    }
  }, [authUser?.id, fetchUsers, isRefreshingDiscovery]);

  useEffect(() => {
    if (!currentUser || loading) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleNope();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleLike();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleOpenProfile();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleCloseProfile();
      } else if (event.key === 'n' || event.key === 'N') {
        event.preventDefault();
        goToNextPhoto();
      } else if (event.key === 'p' || event.key === 'P') {
        event.preventDefault();
        goToPrevPhoto();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentUser, handleCloseProfile, handleLike, handleNope, handleOpenProfile, goToNextPhoto, goToPrevPhoto, loading]);

  const displayName = currentUser?.gamertag ? currentUser.gamertag.replace(/^@/, '') : 'Gamer';
  const currentUserReferrer = currentUser?.referrer;
  const likeOpacity = Math.max(0, Math.min(1, currentDragX / (screenWidth * 0.5)));
  const nopeOpacity = Math.max(0, Math.min(1, -currentDragX / (screenWidth * 0.5)));

  return (
    <div className="relative flex-1 overflow-hidden bg-black">
      <div className="relative mx-auto flex h-[calc(100dvh-86px)] max-w-7xl flex-col items-center px-4 pb-24 pt-2 sm:pb-0 sm:pt-4">
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/80" />
          </div>
        ) : !currentUser && !loadingMore ? (
          <div className="flex flex-1 flex-col items-center justify-between text-center w-full px-6 pt-12 pb-0">
            <div className="flex flex-col items-center justify-center max-w-lg">
              <img
                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTl5czd2ZDVpYnZiZjBlYjYxdzQyNHQ1amtzaDdkaTYzejB1azRreSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCdPNT81vlv3y/giphy.gif"
                alt=""
                className="mb-4 h-[320px] w-[320px] object-contain sm:h-[380px] sm:w-[380px]"
              />
              <p className="text-2xl font-semibold text-white sm:text-3xl">Wanna help out?</p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                We are growing and <span className="font-semibold text-primary">paying everyone</span> that wants to help. Send us a message if you are interested.
              </p>
              <a
                href="https://wa.me/306988617790"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary/90 sm:text-lg"
              >
                Shoot us a text
              </a>
            </div>

            <button
              type="button"
              onClick={handleRefreshDiscovery}
              disabled={isRefreshingDiscovery}
              className="mb-[calc(env(safe-area-inset-bottom)+12px)] text-sm font-semibold text-white underline underline-offset-4 transition-opacity hover:opacity-80 disabled:opacity-60"
            >
              {isRefreshingDiscovery ? 'Refreshing...' : 'Refresh Discovery'}
            </button>
          </div>
        ) : !currentUser && loadingMore ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white/80" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-start pt-1 w-full sm:justify-center sm:pt-0">
            <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[68vh] sm:max-w-none sm:aspect-video sm:max-h-[75vh]">
              {[0, 1, 2].map((slotIndex) => {
                const relativeIndex = (slotIndex - (currentIndex % SLOT_COUNT) + SLOT_COUNT) % SLOT_COUNT;
                const profileIndex = currentIndex + relativeIndex;
                const profile = users[profileIndex];
                if (!profile) return null;

                const isCurrent = profileIndex === currentIndex;
                const isNext = profileIndex === currentIndex + 1;
                if (!isCurrent && !isNext) return null;

                const clips = clipsByUser[profile.id] || getUserClips(profile);
                const clipIndex = clipIndices[profile.id] ?? 0;
                const activeClip = (clips[clipIndex] as ClipWithProcessing | undefined) || null;
                const activeVideoUrl = getPlayableVideoUrl(activeClip);
                const clipKey = activeClip ? `${profile.id}-${activeClip.id}` : '';
                const isPortraitClip = clipKey ? (clipOrientations[clipKey] === 'portrait') : false;

                const transform = slotTransforms[slotIndex] || SLOT_EMPTY;
                const styleTransform = isCurrent
                  ? {
                      x: transform.x,
                      y: transform.y,
                      rotate: transform.rotate,
                    }
                  : {
                      x: 0,
                      y: 10,
                      rotate: 0,
                    };

                return (
                  <motion.div
                    key={`slot-${slotIndex}`}
                    drag={isCurrent ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDrag={isCurrent ? onCardDrag : undefined}
                    onDragEnd={
                      isCurrent ? (event, info) => onCardDragEnd(event, info, slotIndex) : undefined
                    }
                    animate={styleTransform}
                    transition={
                      isCurrent
                        ? isSwipeCommitted
                          ? { type: 'tween', duration: 0.22, ease: 'easeOut' }
                          : { type: 'spring', stiffness: 320, damping: 30, mass: 0.85 }
                        : { duration: 0.2, ease: 'easeOut' }
                    }
                    className={`absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-[9/16] overflow-hidden rounded-3xl border bg-zinc-900 sm:aspect-video ${
                      isCurrent
                        ? 'z-10 cursor-grab active:cursor-grabbing border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.65)]'
                        : 'z-0 scale-[0.97] border-white/10 opacity-90'
                    }`}
                    style={{ touchAction: isCurrent ? 'pan-y' : 'auto' }}
                  >
                    {activeClip && activeVideoUrl ? (
                      <>
                        {isPortraitClip && activeClip.thumbnail_url && (
                          <img
                            src={activeClip.thumbnail_url}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 brightness-50"
                          />
                        )}
                        <video
                          key={`${profile.id}-${activeClip.id}-${isCurrent ? 'current' : 'next'}`}
                          src={activeVideoUrl}
                          poster={activeClip.thumbnail_url}
                          onLoadedMetadata={(event) => {
                            const video = event.currentTarget;
                            const clipKey = `${profile.id}-${activeClip.id}`;
                            const orientation =
                              video.videoWidth > video.videoHeight
                                ? 'landscape'
                                : video.videoWidth < video.videoHeight
                                  ? 'portrait'
                                  : 'square';
                            setClipOrientations((prev) =>
                              prev[clipKey] === orientation ? prev : { ...prev, [clipKey]: orientation }
                            );
                          }}
                          className={`absolute inset-0 h-full w-full ${
                            isPortraitClip ? 'object-contain' : 'object-cover'
                          }`}
                          muted={isMuted}
                          playsInline
                          loop
                          autoPlay={isCurrent}
                          preload="auto"
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                        <Users className="h-14 w-14 text-white/40" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {isCurrent && (
                      <>
                        {clips.length > 1 && (
                          <>
                            <button
                              type="button"
                              aria-label="Previous clip"
                              onClick={(event) => {
                                event.stopPropagation();
                                goToPrevClipForUser(profile.id, clips.length);
                              }}
                              className="absolute left-0 top-0 z-20 h-[70%] w-1/2 cursor-pointer"
                            />
                            <button
                              type="button"
                              aria-label="Next clip"
                              onClick={(event) => {
                                event.stopPropagation();
                                goToNextClipForUser(profile.id, clips.length);
                              }}
                              className="absolute right-0 top-0 z-20 h-[70%] w-1/2 cursor-pointer"
                            />
                          </>
                        )}

                        <div
                          className="absolute left-12 top-[10%] z-20 rounded-lg bg-[rgba(255,0,52,0.85)] px-5 py-3"
                          style={{ transform: 'rotate(-30deg)', opacity: likeOpacity }}
                        >
                          <span className="text-xl font-extrabold tracking-wide text-white">LIKE</span>
                        </div>

                        <div
                          className="absolute right-12 top-[10%] z-20 rounded-lg bg-black/80 px-5 py-3"
                          style={{ transform: 'rotate(30deg)', opacity: nopeOpacity }}
                        >
                          <span className="text-xl font-extrabold tracking-wide text-white">NOPE</span>
                        </div>

                        <div className="absolute left-3 right-3 top-3 flex gap-1.5">
                          {(clips.length > 0 ? clips : [null]).map((_, index) => (
                            <div
                              key={`${profile.id}-clip-${index}`}
                              className={`h-1.5 flex-1 rounded-full ${
                                index === clipIndex ? 'bg-white' : 'bg-white/45'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 pb-9 sm:pb-5">
                          <div className="mb-1 flex items-center gap-2 text-sm text-white/90">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Recently Active
                          </div>

                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl sm:text-4xl font-extrabold leading-none text-white">
                              {displayName}
                            </h2>
                            {currentUserReferrer && (
                              <div className="group/referral relative flex h-6 items-center self-center">
                                <Link
                                  href={`/${locale}/app/profile/${encodeURIComponent(currentUserReferrer.gamertag)}`}
                                  aria-label={`This profile joined Gamerplug through @${currentUserReferrer.gamertag}'s referral.`}
                                  className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 transition hover:scale-105 hover:border-white/20"
                                >
                                  <img
                                    src={currentUserReferrer.profile_image_url || '/images/logo-no-back.png'}
                                    alt={currentUserReferrer.profile_image_url ? `@${currentUserReferrer.gamertag}` : 'GamerPlug referral badge'}
                                    className={currentUserReferrer.profile_image_url ? 'h-full w-full object-cover' : 'h-full w-full object-contain bg-white/10 p-[1px]'}
                                  />
                                </Link>
                                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-center text-[11px] leading-snug text-white/80 opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition duration-150 group-hover/referral:opacity-100">
                                  This profile joined Gamerplug through @{currentUserReferrer.gamertag}&apos;s referral.
                                </div>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            className="mt-2 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                          >
                            {isProfileOpen ? 'Close Profile' : 'Open Profile'}
                          </button>

                          {isProfileOpen && (
                            <div className="mt-3 rounded-xl border border-white/15 bg-black/45 p-3 text-xs text-white/85 backdrop-blur">
                              <p className="line-clamp-3">{currentUser.bio || 'No bio added yet.'}</p>
                              <Link
                                href={`/${locale}/app/profile/${currentUser.gamertag}`}
                                className="mt-2 inline-block text-sm font-semibold text-white underline underline-offset-4"
                              >
                                Go to full profile
                              </Link>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                          onClick={(event) => {
                            event.stopPropagation();
                            setIsMuted((prev) => !prev);
                          }}
                          className="absolute bottom-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:bg-black/70"
                        >
                          {isMuted ? (
                            <VolumeOff className="h-5 w-5 text-white" />
                          ) : (
                            <Volume2 className="h-5 w-5 text-white" />
                          )}
                        </button>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-8 sm:hidden">
              <ActionButton label="Nope" onClick={handleNope}>
                <X className="h-8 w-8 text-rose-400" strokeWidth={3} />
              </ActionButton>
              <ActionButton label="Like" onClick={handleLike}>
                <Heart className="h-8 w-8 text-lime-300" fill="currentColor" />
              </ActionButton>
            </div>

            <div className="mt-5 hidden items-center gap-12 sm:flex">
              <ActionButton label="Nope" onClick={handleNope}>
                <X className="h-8 w-8 text-rose-400" strokeWidth={3} />
              </ActionButton>
              <ActionButton label="Like" onClick={handleLike}>
                <Heart className="h-8 w-8 text-lime-300" fill="currentColor" />
              </ActionButton>
            </div>

          </div>
        )}
      </div>

      {!loading && currentUser && (
        <div className="absolute bottom-3 left-0 right-0 hidden sm:flex items-center justify-center gap-2 whitespace-nowrap text-xs font-semibold text-white/80">
          <KeyHint keyLabel="←" label="Nope" onClick={handleNope} />
          <KeyHint keyLabel="→" label="Like" onClick={handleLike} />
          <KeyHint keyLabel="↑" label="Open Profile" onClick={handleOpenProfile} />
          <KeyHint keyLabel="↓" label="Close Profile" onClick={handleCloseProfile} />
          <KeyHint keyLabel="P" label="Prev Clip" onClick={goToPrevPhoto} />
          <KeyHint keyLabel="N" label="Next Clip" onClick={goToNextPhoto} />
        </div>
      )}

      {showMatchModal && matchedUser && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="relative flex flex-col items-center gap-5 rounded-3xl border border-white/15 bg-[#0d1117] mx-4 px-6 py-8 sm:px-10 sm:py-10 shadow-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              {authUser?.profile_image_url ? (
                <img
                  src={authUser.profile_image_url}
                  alt={authUser.gamertag}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-primary object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-primary bg-zinc-800">
                  <Users className="h-7 w-7 text-white/50" />
                </div>
              )}
              <Heart className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-primary" fill="currentColor" />
              {matchedUser.profile_image_url ? (
                <img
                  src={matchedUser.profile_image_url}
                  alt={matchedUser.gamertag}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-primary object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-primary bg-zinc-800">
                  <Users className="h-7 w-7 text-white/50" />
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">It&apos;s a Match!</p>
              <p className="mt-1 text-sm text-white/60">
                You and <span className="font-semibold text-white">{matchedUser.gamertag}</span> liked each other.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/app/matches`}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                onClick={() => setShowMatchModal(false)}
              >
                View Matches
              </Link>
              <button
                type="button"
                onClick={() => setShowMatchModal(false)}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#151a25] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition hover:scale-110 hover:border-white/30"
    >
      {children}
    </button>
  );
}

function KeyHint({
  keyLabel,
  label,
  onClick,
}: {
  keyLabel: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-1 py-1 text-[11px] text-white/80 transition hover:text-white"
    >
      <span className="inline-flex min-w-6 items-center justify-center rounded-md border border-[#93a0b6] px-1.5 py-0.5 text-[10px] leading-none text-[#c7cfdb]">
        {keyLabel}
      </span>
      <span>{label}</span>
    </button>
  );
}
