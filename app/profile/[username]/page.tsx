'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase, User, Clip, Game, UserGame, TABLES } from '@/lib/supabase';
import VideoModal from '@/components/VideoModal';
import { Footer } from '@/components/Footer';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import LoLStats from '@/components/LoLStats';
import { getGameAssetUrl, getPlatformAssetUrl } from '@/lib/assets';

interface UserWithGames extends User {
  user_games: (UserGame & { games: Game })[];
}

const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white/10 rounded ${className}`} />
);

function ProfileSkeleton() {
  const clipSkeletons = Array.from({ length: 9 });
  const gameSkeletons = Array.from({ length: 3 });

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <div className="relative w-full flex-1 overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[420px] h-[420px] bg-primary/20 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-accent/25 blur-[180px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10"></div>
        </div>
        <div className="relative container mx-auto pt-28 pb-16 px-6 md:px-10 lg:px-12 xl:px-16 max-w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="flex flex-col items-center mb-5 lg:items-start lg:sticky lg:top-8 w-full">
                <div className="mb-4 lg:mb-6 animate-pulse">
                  <div className="w-[100px] h-[100px] lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full bg-white/10" />
                </div>
                <div className="text-center lg:text-left w-full space-y-3 animate-pulse">
                  <SkeletonLine className="h-6 w-2/3 mx-auto lg:mx-0" />
                  <SkeletonLine className="h-4 w-1/3 mx-auto lg:mx-0" />
                  <SkeletonLine className="h-4 w-1/2 mx-auto lg:mx-0" />
                  <SkeletonLine className="h-20 w-full mx-auto lg:mx-0" />
                </div>

                <div className="hidden lg:block w-full mt-8 space-y-3">
                  <div className="py-4 px-4 bg-white/5 rounded-lg animate-pulse">
                    <SkeletonLine className="h-5 w-1/2" />
                    <SkeletonLine className="h-4 w-1/3 mt-2" />
                  </div>
                  {gameSkeletons.map((_, idx) => (
                    <div key={`sidebar-game-${idx}`} className="p-4 bg-white/5 rounded-lg animate-pulse">
                      <SkeletonLine className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 xl:col-span-9">
              <div className="mb-5 lg:hidden space-y-3">
                <div className="py-4 px-4 bg-white/5 rounded-lg animate-pulse">
                  <SkeletonLine className="h-5 w-1/3" />
                  <SkeletonLine className="h-4 w-1/4 mt-2" />
                </div>
                {gameSkeletons.map((_, idx) => (
                  <div key={`mobile-game-${idx}`} className="p-4 bg-white/5 rounded-lg animate-pulse">
                    <SkeletonLine className="h-4 w-1/2" />
                  </div>
                ))}
              </div>

              <div className="flex-1">
                <SkeletonLine className="h-6 w-20 mb-4 lg:mb-6 animate-pulse" />
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
                  {clipSkeletons.map((_, idx) => (
                    <div
                      key={`clip-skeleton-${idx}`}
                      className="aspect-[3/4] bg-white/5 rounded-lg overflow-hidden relative animate-pulse"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [user, setUser] = useState<UserWithGames | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Searching for user with gamertag:', username);

      // First, let's try a simple query to see if the user exists at all
      const { data: simpleUserData, error: simpleError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('gamertag', username);

      console.log('Simple user query result:', { data: simpleUserData, error: simpleError });

      if (simpleError) {
        console.error('Error in simple user query:', simpleError);
        setError('Database error occurred');
        return;
      }

      if (!simpleUserData || simpleUserData.length === 0) {
        console.log('No user found with gamertag:', username);
        
        // Let's also try case-insensitive search
        const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .ilike('gamertag', username);

        console.log('Case-insensitive search result:', { data: caseInsensitiveData, error: caseInsensitiveError });

        if (!caseInsensitiveData || caseInsensitiveData.length === 0) {
          setError('User not found');
          return;
        }
      }

      // Now fetch user with games if we found them
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select(`
          *,
          user_games (
            *,
            games (*)
          )
        `)
        .eq('gamertag', username)
        .single();

      console.log('Full user query result:', { data: userData, error: userError });

      if (userError) {
        console.error('Error fetching user with games:', userError);
        // If the join fails, fall back to just the user data
        const foundUser = simpleUserData?.[0];
        if (foundUser) {
          setUser({ ...foundUser, user_games: [] });
        } else {
          setError('User not found');
          return;
        }
      } else {
        setUser(userData);
      }

      // Fetch user's public clips
      const currentUser = userData || simpleUserData?.[0];
      if (currentUser?.id) {
        const { data: clipsData, error: clipsError } = await supabase
          .from(TABLES.CLIPS)
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        console.log('Clips query result:', { data: clipsData, error: clipsError });

        if (clipsError) {
          console.error('Error fetching clips:', clipsError);
        } else {
          setClips(clipsData || []);
        }
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleClipPress = (clip: Clip) => {
    const clipIndex = clips.findIndex(c => c.id === clip.id);
    setCurrentClipIndex(clipIndex >= 0 ? clipIndex : 0);
    setShowVideoModal(true);
  };

  const handleCloseModal = () => {
    setShowVideoModal(false);
  };

  const handleNextClip = () => {
    if (currentClipIndex < clips.length - 1) {
      setCurrentClipIndex(currentClipIndex + 1);
    }
  };

  const handlePrevClip = () => {
    if (currentClipIndex > 0) {
      setCurrentClipIndex(currentClipIndex - 1);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[420px] h-[420px] bg-primary/20 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-accent/25 blur-[180px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10"></div>
        </div>

        <div className="relative flex-1 flex items-center justify-center px-6 py-24">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/20 blur-2xl"></div>
            <div className="relative rounded-[2rem] border border-white/10 bg-card/70 backdrop-blur-xl p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-[0_0_30px_rgba(220,38,38,0.35)]">
                <AlertTriangle size={36} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-3">User Not Found</h2>
              <p className="text-white/70 leading-relaxed mb-8">
                {error || 'The gamer profile you\'re looking for hasn\'t joined the lobby yet.'}
              </p>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold tracking-wide uppercase shadow-[0_15px_40px_rgba(220,38,38,0.45)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <div className="relative w-full flex-1 overflow-x-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-20%] w-[420px] h-[420px] bg-primary/20 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-accent/25 blur-[180px] rounded-full"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10"></div>
        </div>
        <div className="relative container mx-auto pt-28 pb-16 px-6 md:px-10 lg:px-12 xl:px-16 max-w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-4 xl:col-span-3">
              {/* Profile Section */}
              <div className="flex flex-col items-center mb-5 lg:items-start lg:sticky lg:top-8">
                <div className="mb-4 lg:mb-6">
                  {user.profile_image_url ? (
                    <Image
                      src={user.profile_image_url}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full lg:w-28 lg:h-28 xl:w-32 xl:h-32"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] lg:w-28 lg:h-28 xl:w-32 xl:h-32 rounded-full bg-white/10 flex items-center justify-center">
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" className="lg:w-12 lg:h-12">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center lg:text-left w-full">
                  <h2 className="text-lg font-medium text-white lg:text-xl xl:text-2xl mb-3 font-space-mono">
                    @{user.gamertag}
                  </h2>
                  {user.platform && Array.isArray(user.platform) && user.platform.length > 0 && (
                    <div className="flex gap-2 justify-center lg:justify-start flex-wrap mb-3">
                      {user.platform.map((platform) => {
                        const platformIconUrl = getPlatformAssetUrl(platform);
                        return (
                          <div
                            key={platform}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/90 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md lg:text-sm lg:px-4 lg:py-2"
                          >
                            {platformIconUrl && (
                              <Image
                                src={platformIconUrl}
                                alt={platform}
                                width={16}
                                height={16}
                                className="w-4 h-4 object-contain rounded-[4px]"
                                unoptimized
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                }}
                              />
                            )}
                            <span>{platform}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {user.age && (
                    <p className="text-sm text-white/50 mb-3 lg:text-base">
                      Age: {user.age}
                    </p>
                  )}
                  {user.bio && (
                    <p className="text-sm text-white/80 mt-3 max-w-xs lg:max-w-none lg:text-base leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                </div>

                {/* Games Section - Desktop Sidebar */}
                <div className="hidden lg:block w-full mt-8">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 px-5 py-4 mb-4">
                    <div className="absolute inset-0 opacity-40 blur-3xl bg-gradient-to-r from-primary/30 to-accent/30" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center text-primary shadow-[0_8px_25px_rgba(220,38,38,0.35)]">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="10" rx="2"/>
                            <path d="M6 12h4"/>
                            <path d="M8 10v4"/>
                            <circle cx="16" cy="12" r="1"/>
                            <circle cx="18" cy="10" r="1"/>
                            <circle cx="18" cy="14" r="1"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Games</p>
                          <p className="text-xl font-semibold text-white">{user.user_games?.length || 0} in rotation</p>
                        </div>
                      </div>
                      {user.user_games && user.user_games.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {user.user_games.map((userGame) => {
                            const imageUrl = getGameAssetUrl(userGame.games.display_name);

                            return (
                              <div key={userGame.id} className="relative group aspect-square">
                                <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all duration-200 hover:scale-105">
                                  <Image
                                    src={imageUrl}
                                    alt={userGame.games.display_name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {user.user_games && user.user_games.length > 0 && (
                    <div className="space-y-4">
                      {user.user_games.map((userGame) => {
                        const isLoL = userGame.games.name === 'league-of-legends';
                        if (isLoL && userGame.player_id) {
                          return (
                            <div key={`lol-stats-${userGame.id}`}>
                              <LoLStats playerId={userGame.player_id} />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Games Section - Mobile Only */}
              <div className="mb-5 lg:hidden">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 px-4 py-4 mb-3">
                  <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-primary/30 to-accent/30" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="10" rx="2"/>
                          <path d="M6 12h4"/>
                          <path d="M8 10v4"/>
                          <circle cx="16" cy="12" r="1"/>
                          <circle cx="18" cy="10" r="1"/>
                          <circle cx="18" cy="14" r="1"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Games</p>
                        <p className="text-lg font-semibold text-white">{user.user_games?.length || 0} squads</p>
                      </div>
                    </div>
                    {user.user_games && user.user_games.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4">
                        {user.user_games.map((userGame) => {
                          const imageUrl = getGameAssetUrl(userGame.games.display_name);

                          return (
                            <div key={userGame.id} className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                                <Image
                                  src={imageUrl}
                                  alt={userGame.games.display_name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  unoptimized
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {user.user_games && user.user_games.length > 0 && (
                  <div className="space-y-4">
                    {user.user_games.map((userGame) => {
                      const isLoL = userGame.games.name === 'league-of-legends';
                      if (isLoL && userGame.player_id) {
                        return (
                          <div key={`lol-stats-mobile-${userGame.id}`}>
                            <LoLStats playerId={userGame.player_id} />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>

              {/* Clips Section */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 text-white lg:text-2xl lg:mb-6">Clips</h3>
                
                {clips.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
                {clips.map((clip) => (
                  <button
                    key={clip.id}
                    onClick={() => handleClipPress(clip)}
                    className="relative aspect-[3/4] bg-white/5 rounded overflow-hidden group hover:bg-white/10 transition-colors"
                  >
                    {clip.thumbnail_url ? (
                      <Image
                        src={clip.thumbnail_url}
                        alt={clip.title || 'Clip thumbnail'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 flex flex-col items-center justify-center bg-white/5 rounded-lg border border-dashed border-white/10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
                </svg>
                <p className="text-base text-gray-400 mt-2">No public clips</p>
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={handleCloseModal}
        clips={clips}
        currentIndex={currentClipIndex}
        onNext={handleNextClip}
        onPrev={handlePrevClip}
      />
      <Footer />
    </div>
  );
}
