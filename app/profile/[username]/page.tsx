'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase, User, Clip, Game, UserGame, TABLES } from '@/lib/supabase';
import VideoModal from '@/components/VideoModal';

interface UserWithGames extends User {
  user_games: (UserGame & { games: Game })[];
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
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3B30] mb-4"></div>
          <p className="text-white/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-white/70 mb-6">{error || 'The user you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#FF3B30] text-white px-6 py-3 rounded-lg hover:bg-[#FF3B30]/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full bg-black min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-center p-5 pt-12 lg:px-8 lg:pt-8 max-w-screen-xl mx-auto">
          <h1 className="text-xl font-bold text-white lg:text-3xl">Gamerplug</h1>
        </header>

        <div className="px-5 pb-6 lg:px-8 lg:pb-8 max-w-screen-xl mx-auto">
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
                      className="rounded-full lg:w-40 lg:h-40 xl:w-48 xl:h-48"
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full bg-white/10 flex items-center justify-center">
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" className="lg:w-16 lg:h-16">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center lg:text-left w-full">
                  <h2 className="text-lg font-medium text-white lg:text-2xl xl:text-3xl mb-2">
                    @{user.gamertag}
                  </h2>
                  {user.platform && (
                    <p className="text-sm text-white/70 mb-2 lg:text-lg">
                      {user.platform}
                    </p>
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
                  <div className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg mb-3">
                    <div className="flex items-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" className="mr-3">
                        <path d="M6 12h4l3 9 4-9h4c1 0 2-1 2-2V7c0-1-1-2-2-2H2c-1 0-2 1-2 2v3c0 1 1 2 2 2Z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-base font-semibold text-white">Games</div>
                        <div className="text-sm text-white/70">{user.user_games?.length || 0} games</div>
                      </div>
                    </div>
                  </div>

                  {/* Games List */}
                  {user.user_games && user.user_games.length > 0 && (
                    <div className="space-y-2">
                      {user.user_games.slice(0, 5).map((userGame) => (
                        <div key={userGame.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                          <div className="w-8 h-8 bg-white/10 rounded mr-3 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2">
                              <path d="M6 12h4l3 9 4-9h4c1 0 2-1 2-2V7c0-1-1-2-2-2H2c-1 0-2 1-2 2v3c0 1 1 2 2 2Z"/>
                            </svg>
                          </div>
                          <span className="text-white text-sm">{userGame.games.display_name}</span>
                        </div>
                      ))}
                      {user.user_games.length > 5 && (
                        <div className="text-center text-white/50 text-sm">
                          +{user.user_games.length - 5} more games
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Games Section - Mobile Only */}
              <div className="mb-5 lg:hidden">
                <div className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg mb-3 hover:bg-white/10 transition-colors">
                  <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2" className="mr-3">
                      <path d="M6 12h4l3 9 4-9h4c1 0 2-1 2-2V7c0-1-1-2-2-2H2c-1 0-2 1-2 2v3c0 1 1 2 2 2Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Games</div>
                      <div className="text-sm text-white/70">{user.user_games?.length || 0} games</div>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>

                {/* Games List - Mobile */}
                {user.user_games && user.user_games.length > 0 && (
                  <div className="space-y-2">
                    {user.user_games.slice(0, 3).map((userGame) => (
                      <div key={userGame.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 bg-white/10 rounded mr-3 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="2">
                            <path d="M6 12h4l3 9 4-9h4c1 0 2-1 2-2V7c0-1-1-2-2-2H2c-1 0-2 1-2 2v3c0 1 1 2 2 2Z"/>
                          </svg>
                        </div>
                        <span className="text-white text-sm">{userGame.games.display_name}</span>
                      </div>
                    ))}
                    {user.user_games.length > 3 && (
                      <div className="text-center text-white/50 text-sm">
                        +{user.user_games.length - 3} more games
                      </div>
                    )}
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
    </div>
  );
}