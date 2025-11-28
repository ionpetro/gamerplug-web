'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LoLPlayerStats, LeagueEntry, getRankDisplay } from '@/lib/riot-api';

interface LoLStatsProps {
  playerId: string;
}

// Champion name cache
let championNamesCache: Record<number, string> | null = null;

export default function LoLStats({ playerId }: LoLStatsProps) {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [stats, setStats] = useState<LoLPlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [championNames, setChampionNames] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchStats();
    fetchChampionNames();
  }, [playerId]);

  const fetchChampionNames = async () => {
    // Use cache if available
    if (championNamesCache) {
      setChampionNames(championNamesCache);
      return;
    }

    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.23.1/data/en_US/champion.json');
      const data = await response.json();

      // Build championId -> name mapping
      const nameMap: Record<number, string> = {};
      Object.values(data.data).forEach((champ: any) => {
        nameMap[parseInt(champ.key)] = champ.name;
      });

      championNamesCache = nameMap;
      setChampionNames(nameMap);
    } catch (err) {
      console.error('Failed to fetch champion names');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/lol-stats?playerId=${encodeURIComponent(playerId)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Player not found');
        } else {
          setError('Failed to load stats');
        }
        return;
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse w-32" />
            <div className="h-3 bg-white/10 rounded animate-pulse w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded animate-pulse" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-4/5" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <p className="text-sm text-white/60">{error || 'Stats unavailable'}</p>
        </div>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      CHALLENGER: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
      GRANDMASTER: 'from-red-500/20 to-pink-500/20 border-red-500/30',
      MASTER: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
      DIAMOND: 'from-blue-400/20 to-cyan-500/20 border-blue-400/30',
      EMERALD: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
      PLATINUM: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30',
      GOLD: 'from-yellow-600/20 to-yellow-500/20 border-yellow-600/30',
      SILVER: 'from-gray-400/20 to-gray-500/20 border-gray-400/30',
      BRONZE: 'from-orange-700/20 to-orange-600/20 border-orange-700/30',
      IRON: 'from-gray-600/20 to-gray-700/20 border-gray-600/30',
    };
    return colors[tier] || 'from-white/10 to-white/5 border-white/10';
  };

  const soloRank = stats.rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5');
  const flexRank = stats.rankedStats.find(r => r.queueType === 'RANKED_FLEX_SR');

  // Helper function to get champion square image URL from Community Dragon (uses champion ID directly)
  const getChampionImageUrl = (championId: number) => {
    // Community Dragon CDN uses champion IDs directly
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;
  };

  // Helper to format mastery points
  const formatMasteryPoints = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(0)}K`;
    return points.toString();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-5">
      <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-primary/20 to-accent/20" />
      <div className="relative space-y-4">
        {/* Summoner Info Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${stats.summoner.profileIconId}.png`}
              alt="Profile Icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-base font-semibold text-white">League of Legends</p>
            <p className="text-sm text-white/60">Level {stats.summoner.summonerLevel}</p>
          </div>
        </div>

        {/* Ranked Stats */}
        {(soloRank || flexRank) && (
          <div className="space-y-3">
            {soloRank && (
              <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${getTierColor(soloRank.tier)}`}>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs uppercase tracking-wider text-white/60">Ranked Solo/Duo</p>
                    {soloRank.hotStreak && (
                      <span className="px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-400">
                        Hot Streak
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-lg font-bold text-white">
                      {soloRank.tier} {soloRank.rank}
                    </p>
                    <p className="text-sm text-white/70">{soloRank.leaguePoints} LP</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>{soloRank.wins}W {soloRank.losses}L</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>
                      {soloRank.wins + soloRank.losses > 0
                        ? Math.round((soloRank.wins / (soloRank.wins + soloRank.losses)) * 100)
                        : 0}% WR
                    </span>
                  </div>
                </div>
              </div>
            )}

            {flexRank && (
              <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 ${getTierColor(flexRank.tier)}`}>
                <div className="relative">
                  <p className="text-xs uppercase tracking-wider text-white/60 mb-2">Ranked Flex</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-lg font-bold text-white">
                      {flexRank.tier} {flexRank.rank}
                    </p>
                    <p className="text-sm text-white/70">{flexRank.leaguePoints} LP</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>{flexRank.wins}W {flexRank.losses}L</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>
                      {flexRank.wins + flexRank.losses > 0
                        ? Math.round((flexRank.wins / (flexRank.wins + flexRank.losses)) * 100)
                        : 0}% WR
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Champions */}
        {stats.topChampions && stats.topChampions.length > 0 && (
          <div className="pt-4">
            <p className="text-xs uppercase tracking-wider text-white/60 mb-3">Top Champions</p>
            <div className="flex gap-2 md:gap-3">
              {stats.topChampions.slice(0, 3).map((champion, index) => (
                <div key={champion.championId} className="flex-1 max-w-[80px] md:max-w-none">
                  <div className="relative group">
                    <div className="w-full aspect-square rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all">
                      <img
                        src={getChampionImageUrl(champion.championId)}
                        alt={championNames[champion.championId] || `Champion ${champion.championId}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if champion image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black border-2 border-black">
                      {champion.championLevel}
                    </div>
                    {/* Champion name tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {championNames[champion.championId] || 'Loading...'}
                    </div>
                  </div>
                  <div className="mt-1.5 text-center">
                    <p className="text-xs font-semibold text-white/90">{formatMasteryPoints(champion.championPoints)}</p>
                    <p className="text-[10px] text-white/50">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => router.push(`/profile/${username}/league-of-legends`)}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 hover:from-primary/30 hover:to-accent/30 transition-all text-sm font-semibold text-white"
          >
            View Detailed Stats →
          </button>
        </div>
      </div>
    </div>
  );
}
