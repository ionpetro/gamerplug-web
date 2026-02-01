'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase, User, Clip, TABLES } from '@/lib/supabase';
import { getGameAssetUrl, getPlatformAssetUrl } from '@/lib/assets';
import { Play, Users, Gamepad2, Loader2 } from 'lucide-react';

interface UserWithClips extends User {
  clips: Clip[];
}

export default function ExplorePage() {
  const [users, setUsers] = useState<UserWithClips[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users who have clips
      const { data: usersData, error } = await supabase
        .from(TABLES.USERS)
        .select(`
          *,
          clips (*)
        `)
        .eq('clips.is_public', true)
        .not('gamertag', 'is', null)
        .limit(20);

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Filter users who have at least one clip
      const usersWithClips = (usersData || []).filter(
        (user: UserWithClips) => user.clips && user.clips.length > 0
      );

      setUsers(usersWithClips);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
        </div>

        <div className="relative container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Gamepad2 className="text-primary" />
              Explore Gamers
            </h1>
            <p className="text-white/60">
              Discover players and find your next squad
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/en/app/profile/${user.gamertag}`}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Thumbnail */}
                  {user.clips[0]?.thumbnail_url ? (
                    <Image
                      src={user.clips[0].thumbnail_url}
                      alt={user.gamertag}
                      fill
                      className="object-cover"
                    />
                  ) : user.profile_image_url ? (
                    <Image
                      src={user.profile_image_url}
                      alt={user.gamertag}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Users size={40} className="text-white/30" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Icon */}
                  {user.clips.length > 0 && (
                    <div className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={14} fill="white" className="text-white" />
                    </div>
                  )}

                  {/* User Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      {user.profile_image_url && (
                        <Image
                          src={user.profile_image_url}
                          alt=""
                          width={24}
                          height={24}
                          className="rounded-full border border-white/20"
                        />
                      )}
                      <span className="font-medium text-sm truncate">
                        @{user.gamertag}
                      </span>
                    </div>
                    {user.platform && Array.isArray(user.platform) && (
                      <div className="flex gap-1">
                        {user.platform.slice(0, 3).map((platform) => {
                          const iconUrl = getPlatformAssetUrl(platform);
                          return iconUrl ? (
                            <Image
                              key={platform}
                              src={iconUrl}
                              alt={platform}
                              width={14}
                              height={14}
                              className="rounded-sm"
                              unoptimized
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>

                  {/* Clip Count Badge */}
                  {user.clips.length > 0 && (
                    <div className="absolute top-3 left-3 bg-black/50 rounded-full px-2 py-0.5 text-xs">
                      {user.clips.length} clips
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users size={48} className="text-white/20 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No gamers found</h2>
              <p className="text-white/50">
                Be the first to upload clips and get discovered!
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
