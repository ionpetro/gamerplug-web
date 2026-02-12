'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, User, Clip, Game, UserGame, TABLES } from '@/lib/supabase';
import { uploadClip, deleteClip as deleteClipApi } from '@/lib/clips';
import VideoModal from '@/components/VideoModal';
import { getGameAssetUrl, getPlatformAssetUrl } from '@/lib/assets';
import {
  Share2,
  Edit3,
  Play,
  Video,
  Gamepad2,
  Loader2,
  Upload,
  ChevronRight,
  X
} from 'lucide-react';

interface UserWithGames extends User {
  user_games: (UserGame & { games: Game })[];
}

const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`bg-white/10 rounded animate-pulse ${className}`} />
);

function ProfileSkeleton() {
  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
        <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
      </div>
      <div className="relative container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header Skeleton */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-white/10 animate-pulse mb-4" />
            <SkeletonLine className="h-7 w-40 mb-2" />
            <SkeletonLine className="h-5 w-24" />
          </div>
          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 justify-center mb-8">
            <SkeletonLine className="h-10 w-32 rounded-xl" />
            <SkeletonLine className="h-10 w-32 rounded-xl" />
          </div>
          {/* Clips Skeleton */}
          <SkeletonLine className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthenticatedProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: authUser, session } = useAuth();
  
  const [profileUser, setProfileUser] = useState<UserWithGames | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = authUser?.gamertag?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (username) {
      fetchProfileData();
    }
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch user with games
      const { data: userData, error: userError } = await supabase
        .from(TABLES.USERS)
        .select(`
          *,
          user_games (
            *,
            games (*)
          )
        `)
        .ilike('gamertag', username)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        // Try without games
        const { data: simpleUser } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .ilike('gamertag', username)
          .single();
        
        if (simpleUser) {
          setProfileUser({ ...simpleUser, user_games: [] });
        }
      } else {
        setProfileUser(userData);
      }

      // Fetch clips
      const user = userData || profileUser;
      if (user?.id) {
        const { data: clipsData } = await supabase
          .from(TABLES.CLIPS)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setClips(clipsData || []);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClipPress = (clip: Clip) => {
    const clipIndex = clips.findIndex(c => c.id === clip.id);
    setCurrentClipIndex(clipIndex >= 0 ? clipIndex : 0);
    setShowVideoModal(true);
  };

  const handleShareProfile = async () => {
    const profileUrl = `https://www.gamerplug.app/profile/${profileUser?.gamertag}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${profileUser?.gamertag} on Gamerplug`,
          text: `Check out @${profileUser?.gamertag}'s gaming profile on Gamerplug!`,
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled or error
        await navigator.clipboard.writeText(profileUrl);
      }
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;
    e.target.value = '';

    setUploading(true);
    setUploadStage('Uploading...');

    const result = await uploadClip({
      file,
      userId: session.user.id,
      title: `Clip ${clips.length + 1}`,
      onProgress: (stage) => setUploadStage(stage),
    });

    if (result.success) {
      // Refresh clips
      if (profileUser?.id) {
        const { data: clipsData } = await supabase
          .from(TABLES.CLIPS)
          .select('*')
          .eq('user_id', profileUser.id)
          .order('created_at', { ascending: false });
        setClips(clipsData || []);
      }
    } else {
      alert(result.error || 'Upload failed');
    }

    setUploading(false);
    setUploadStage('');
  };

  const handleDeleteClip = async (clipId: string) => {
    if (!confirm('Delete this clip?')) return;
    const result = await deleteClipApi(clipId);
    if (result.success) {
      setClips(clips.filter((c) => c.id !== clipId));
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileUser) {
    return (
      <div className="relative flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
          <p className="text-white/60">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex-1">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
        </div>

        <div className="relative container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              {/* Avatar */}
              <div className="relative mb-4">
                {profileUser.profile_image_url ? (
                  <Image
                    src={profileUser.profile_image_url}
                    alt="Profile"
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10">
                    <Image
                      src="/logo.png"
                      alt="Default Avatar"
                      width={60}
                      height={60}
                      className="opacity-50"
                    />
                  </div>
                )}
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                    <Edit3 size={14} />
                  </button>
                )}
              </div>

              {/* Gamertag & Age */}
              <div className="text-center mb-3">
                <h1 className="text-2xl font-bold mb-1">
                  @{profileUser.gamertag}
                </h1>
                {profileUser.age && (
                  <span className="text-white/50 text-sm">{profileUser.age} years old</span>
                )}
              </div>

              {/* Platform Badges */}
              {profileUser.platform && Array.isArray(profileUser.platform) && profileUser.platform.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {profileUser.platform.map((platform) => {
                    const platformIconUrl = getPlatformAssetUrl(platform);
                    return (
                      <div
                        key={platform}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg"
                      >
                        {platformIconUrl && (
                          <Image
                            src={platformIconUrl}
                            alt={platform}
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain rounded"
                            unoptimized
                          />
                        )}
                        <span className="text-sm text-white/80">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-white/70 text-center max-w-md mb-4">
                  {profileUser.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center mb-8">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => {/* TODO: Edit profile */}}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                  >
                    <Edit3 size={16} />
                    <span className="font-medium">Edit profile</span>
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                  >
                    <Share2 size={16} />
                    <span className="font-medium">Share profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                >
                  <Share2 size={16} />
                  <span className="font-medium">Share profile</span>
                </button>
              )}
            </div>

            {/* Games Section */}
            {profileUser.user_games && profileUser.user_games.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Gamepad2 size={20} className="text-primary" />
                    Games
                  </h2>
                  {isOwnProfile && (
                    <button className="text-sm text-white/50 hover:text-white flex items-center gap-1">
                      Manage <ChevronRight size={14} />
                    </button>
                  )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {profileUser.user_games.map((userGame) => {
                    const imageUrl = getGameAssetUrl(userGame.games.display_name);
                    return (
                      <div
                        key={userGame.id}
                        className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 transition-colors"
                      >
                        <Image
                          src={imageUrl}
                          alt={userGame.games.display_name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clips Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Video size={20} className="text-primary" />
                  Clips
                </h2>
                {isOwnProfile && clips.length > 0 && (
                  <button
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="text-sm text-white/50 hover:text-white flex items-center gap-1 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        {uploadStage}
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        Upload
                      </>
                    )}
                  </button>
                )}
              </div>

              {isOwnProfile && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              )}

              {clips.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {clips.map((clip) => (
                    <button
                      key={clip.id}
                      onClick={() => handleClipPress(clip)}
                      className="relative aspect-[3/4] bg-white/5 rounded-lg overflow-hidden group hover:ring-2 hover:ring-primary/50 transition-all"
                    >
                      {clip.thumbnail_url ? (
                        <Image
                          src={clip.thumbnail_url}
                          alt={clip.title || 'Clip'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video size={24} className="text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={32} className="text-white" fill="white" />
                      </div>
                      {isOwnProfile && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClip(clip.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1">
                        <Play size={12} className="text-white" fill="white" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                  <Video size={40} className="text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 mb-4">
                    {isOwnProfile ? "You haven't uploaded any clips yet" : "No clips to show"}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={handleUploadClick}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {uploadStage}
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Clips
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* About Section */}
            {profileUser.game_preferences && Object.keys(profileUser.game_preferences).length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">About</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profileUser.game_preferences.playStyle && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Play Style</p>
                      <p className="text-white/90">
                        {Array.isArray(profileUser.game_preferences.playStyle) 
                          ? profileUser.game_preferences.playStyle.join(', ')
                          : profileUser.game_preferences.playStyle}
                      </p>
                    </div>
                  )}
                  {profileUser.game_preferences.micUsage && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Microphone</p>
                      <p className="text-white/90">{profileUser.game_preferences.micUsage}</p>
                    </div>
                  )}
                  {profileUser.game_preferences.personality && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Personality</p>
                      <p className="text-white/90">
                        {Array.isArray(profileUser.game_preferences.personality)
                          ? profileUser.game_preferences.personality.join(', ')
                          : profileUser.game_preferences.personality}
                      </p>
                    </div>
                  )}
                  {profileUser.game_preferences.gamingSchedule && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Gaming Schedule</p>
                      <p className="text-white/90">{profileUser.game_preferences.gamingSchedule}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        clips={clips}
        currentIndex={currentClipIndex}
        onNext={() => setCurrentClipIndex(prev => Math.min(prev + 1, clips.length - 1))}
        onPrev={() => setCurrentClipIndex(prev => Math.max(prev - 1, 0))}
      />
    </>
  );
}
