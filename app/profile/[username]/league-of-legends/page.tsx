'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { LoLPlayerStats, LeagueEntry } from '@/lib/riot-api';
import { Footer } from '@/components/Footer';

// Champion name cache
let championNamesCache: Record<number, string> | null = null;

export default function LeagueOfLegendsStatsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [stats, setStats] = useState<LoLPlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [championNames, setChampionNames] = useState<Record<number, string>>({});
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerIdAndStats();
    fetchChampionNames();
  }, [username]);

  const fetchPlayerIdAndStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user data to get player_id
      const userResponse = await fetch(`/api/users/${username}`);
      if (!userResponse.ok) {
        setError('User not found');
        return;
      }

      const userData = await userResponse.json();
      const lolGame = userData.user_games?.find((ug: any) => ug.games.name === 'league-of-legends');

      if (!lolGame || !lolGame.player_id) {
        setError('League of Legends stats not available for this user');
        return;
      }

      setPlayerId(lolGame.player_id);

      // Fetch LoL stats
      const response = await fetch(`/api/lol-stats?playerId=${encodeURIComponent(lolGame.player_id)}`);

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

  const fetchChampionNames = async () => {
    if (championNamesCache) {
      setChampionNames(championNamesCache);
      return;
    }

    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/15.23.1/data/en_US/champion.json');
      const data = await response.json();

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

  const getChampionImageUrl = (championId: number) => {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${championId}.png`;
  };

  const formatMasteryPoints = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(0)}K`;
    return points.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="container mx-auto pt-28 pb-16 px-6 md:px-10 lg:px-12 xl:px-16">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/10 rounded w-64"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-white/10 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="container mx-auto pt-28 pb-16 px-6 md:px-10 lg:px-12 xl:px-16">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>
          <div className="text-center py-16">
            <p className="text-xl text-white/60">{error || 'Stats unavailable'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const soloRank = stats.rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5');
  const flexRank = stats.rankedStats.find(r => r.queueType === 'RANKED_FLEX_SR');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-20%] w-[420px] h-[420px] bg-blue-500/20 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[520px] h-[520px] bg-purple-500/25 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-10"></div>
      </div>

      <div className="relative container mx-auto pt-28 pb-16 px-6 md:px-10 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Profile
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center overflow-hidden">
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${stats.summoner.profileIconId}.png`}
                alt="Profile Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">League of Legends</h1>
              <p className="text-lg text-white/60">Level {stats.summoner.summonerLevel}</p>
            </div>
          </div>
        </div>

        {/* Ranked Stats */}
        {(soloRank || flexRank) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Ranked Stats</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {soloRank && (
                <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${getTierColor(soloRank.tier)}`}>
                  <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm uppercase tracking-wider text-white/60">Ranked Solo/Duo</p>
                      {soloRank.hotStreak && (
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400 font-semibold">
                          🔥 Hot Streak
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-white mb-1">
                        {soloRank.tier} {soloRank.rank}
                      </p>
                      <p className="text-lg text-white/70">{soloRank.leaguePoints} LP</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">Wins</p>
                        <p className="text-xl font-semibold text-green-400">{soloRank.wins}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Losses</p>
                        <p className="text-xl font-semibold text-red-400">{soloRank.losses}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Win Rate</p>
                        <p className="text-xl font-semibold text-white">
                          {soloRank.wins + soloRank.losses > 0
                            ? Math.round((soloRank.wins / (soloRank.wins + soloRank.losses)) * 100)
                            : 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Total Games</p>
                        <p className="text-xl font-semibold text-white">{soloRank.wins + soloRank.losses}</p>
                      </div>
                    </div>
                    {(soloRank.veteran || soloRank.freshBlood) && (
                      <div className="mt-4 flex gap-2">
                        {soloRank.veteran && (
                          <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400">
                            Veteran
                          </span>
                        )}
                        {soloRank.freshBlood && (
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                            Fresh Blood
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {flexRank && (
                <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 ${getTierColor(flexRank.tier)}`}>
                  <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm uppercase tracking-wider text-white/60">Ranked Flex</p>
                      {flexRank.hotStreak && (
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs text-orange-400 font-semibold">
                          🔥 Hot Streak
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-white mb-1">
                        {flexRank.tier} {flexRank.rank}
                      </p>
                      <p className="text-lg text-white/70">{flexRank.leaguePoints} LP</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">Wins</p>
                        <p className="text-xl font-semibold text-green-400">{flexRank.wins}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Losses</p>
                        <p className="text-xl font-semibold text-red-400">{flexRank.losses}</p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Win Rate</p>
                        <p className="text-xl font-semibold text-white">
                          {flexRank.wins + flexRank.losses > 0
                            ? Math.round((flexRank.wins / (flexRank.wins + flexRank.losses)) * 100)
                            : 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">Total Games</p>
                        <p className="text-xl font-semibold text-white">{flexRank.wins + flexRank.losses}</p>
                      </div>
                    </div>
                    {(flexRank.veteran || flexRank.freshBlood) && (
                      <div className="mt-4 flex gap-2">
                        {flexRank.veteran && (
                          <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-400">
                            Veteran
                          </span>
                        )}
                        {flexRank.freshBlood && (
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                            Fresh Blood
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Champion Mastery */}
        {stats.topChampions && stats.topChampions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Top Champions</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {stats.topChampions.map((champion) => (
                <div
                  key={champion.championId}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-4"
                >
                  <div className="absolute inset-0 opacity-30 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                  <div className="relative">
                    <div className="relative mb-3 group">
                      <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-white/10">
                        <img
                          src={getChampionImageUrl(champion.championId)}
                          alt={championNames[champion.championId] || `Champion ${champion.championId}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-sm font-bold text-black border-2 border-black">
                        {champion.championLevel}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-white mb-1">
                        {championNames[champion.championId] || 'Loading...'}
                      </p>
                      <p className="text-lg font-bold text-white/90">
                        {formatMasteryPoints(champion.championPoints)}
                      </p>
                      <p className="text-xs text-white/50">mastery points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
