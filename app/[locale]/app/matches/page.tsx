'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, User, TABLES } from '@/lib/supabase';
import { getPlatformAssetUrl } from '@/lib/assets';
import { Users, MessageCircle, Loader2, Heart, Sparkles, LayoutGrid, List } from 'lucide-react';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  matched_user: User;
}

export default function MatchesPage() {
  const { user: authUser } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (authUser?.id) {
      fetchMatches();
    }
  }, [authUser?.id]);

  const fetchMatches = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);

      // Fetch matches where user is either user1 or user2
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${authUser.id},user2_id.eq.${authUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        setLoading(false);
        return;
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get the other user's ID for each match
      const otherUserIds = matchesData.map((match) =>
        match.user1_id === authUser.id ? match.user2_id : match.user1_id
      );

      // Fetch the matched users' profiles
      const { data: usersData, error: usersError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .in('id', otherUserIds);

      if (usersError) {
        console.error('Error fetching matched users:', usersError);
        setLoading(false);
        return;
      }

      // Combine matches with user data
      const matchesWithUsers = matchesData.map((match) => {
        const otherUserId = match.user1_id === authUser.id ? match.user2_id : match.user1_id;
        const matchedUser = usersData?.find((u) => u.id === otherUserId);
        return {
          ...match,
          matched_user: matchedUser,
        };
      }).filter((match) => match.matched_user);

      setMatches(matchesWithUsers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative flex-1 overflow-hidden bg-black">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-20%] left-[-15%] w-[520px] h-[520px] bg-primary/20 blur-[190px] rounded-full" />
          <div className="absolute bottom-[-25%] right-[-10%] w-[600px] h-[600px] bg-accent/25 blur-[200px] rounded-full" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-10" />
        </div>

        <div className="relative container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Heart className="text-primary" />
                Your Matches
              </h1>
              <p className="text-white/60">
                Connect with gamers who want to play with you
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-white/50 hover:text-white'}`}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-white/50 hover:text-white'}`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : matches.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/en/app/profile/${match.matched_user.gamertag}`}
                    className="group relative rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/[0.07] transition-all duration-200 overflow-hidden"
                  >
                    {/* Profile Image */}
                    <div className="aspect-square relative">
                      {match.matched_user.profile_image_url ? (
                        <Image
                          src={match.matched_user.profile_image_url}
                          alt={match.matched_user.gamertag}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center">
                          <Users size={48} className="text-white/20" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Match Badge */}
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Sparkles size={12} />
                      </div>
                      
                      {/* Chat Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // TODO: Open chat
                        }}
                        className="absolute top-3 left-3 p-2 rounded-xl bg-black/50 hover:bg-primary text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate text-white">
                          @{match.matched_user.gamertag}
                        </span>
                        {match.matched_user.age && (
                          <span className="text-white/60 text-sm">
                            {match.matched_user.age}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {match.matched_user.platform && Array.isArray(match.matched_user.platform) && (
                          <div className="flex gap-1">
                            {match.matched_user.platform.slice(0, 3).map((platform) => {
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
                        <span className="text-white/50 text-xs">
                          {formatDate(match.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {matches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/en/app/profile/${match.matched_user.gamertag}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/[0.07] transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {match.matched_user.profile_image_url ? (
                        <Image
                          src={match.matched_user.profile_image_url}
                          alt={match.matched_user.gamertag}
                          width={56}
                          height={56}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                          <Users size={24} className="text-white/40" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <Sparkles size={10} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate">
                          @{match.matched_user.gamertag}
                        </span>
                        {match.matched_user.age && (
                          <span className="text-white/40 text-sm">
                            {match.matched_user.age}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {match.matched_user.platform && Array.isArray(match.matched_user.platform) && (
                          <div className="flex gap-1">
                            {match.matched_user.platform.slice(0, 2).map((platform) => {
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
                        <span className="text-white/40 text-xs">
                          Matched {formatDate(match.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Chat Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Open chat
                      }}
                      className="p-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    >
                      <MessageCircle size={20} />
                    </button>
                  </Link>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Heart size={40} className="text-white/20" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
              <p className="text-white/50 mb-6 max-w-sm mx-auto">
                Start swiping on the mobile app to find gamers who share your vibe
              </p>
              <Link
                href="/en/app/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-medium transition-colors"
              >
                <Users size={18} />
                Explore Gamers
              </Link>
            </div>
          )}
        </div>
    </div>
  );
}
