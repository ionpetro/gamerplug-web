// Riot Games API Service for League of Legends
// Documentation: https://developer.riotgames.com/docs/lol

const RIOT_API_KEY = process.env.RIOT_API_KEY || 'RGAPI-df74b34d-2b26-451d-b47c-feeee61fda34';

// Regional routing configuration
const REGIONS = {
  // Americas
  'na1': 'americas',
  'br1': 'americas',
  'la1': 'americas',
  'la2': 'americas',

  // Asia
  'kr': 'asia',
  'jp1': 'asia',

  // Europe
  'euw1': 'europe',
  'eun1': 'europe',
  'tr1': 'europe',
  'ru': 'europe',

  // SEA
  'oc1': 'sea',
  'ph2': 'sea',
  'sg2': 'sea',
  'th2': 'sea',
  'tw2': 'sea',
  'vn2': 'sea',
} as const;

type Platform = keyof typeof REGIONS;
type Region = typeof REGIONS[Platform];

// API Response Types
export interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR' | 'RANKED_FLEX_TT';
  tier: 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
  rank: 'I' | 'II' | 'III' | 'IV';
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface MatchReference {
  matchId: string;
}

export interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
  championName?: string;
}

export interface MatchParticipant {
  puuid: string;
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  teamPosition: string;
  totalMinionsKilled: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  queueId: number;
  participants: MatchParticipant[];
}

export interface Match {
  metadata: {
    matchId: string;
  };
  info: MatchInfo;
}

export interface LoLPlayerStats {
  summoner: Summoner;
  rankedStats: LeagueEntry[];
  recentMatches?: Match[];
  topChampions?: ChampionMastery[];
  totalMasteryScore?: number;
}

// Helper function to make Riot API requests
async function riotRequest<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

// Get account by Riot ID (gameName#tagLine)
export async function getAccountByRiotId(
  gameName: string,
  tagLine: string = 'NA1',
  region: Region = 'americas'
): Promise<RiotAccount | null> {
  const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  return riotRequest<RiotAccount>(url);
}

// Get summoner by PUUID
export async function getSummonerByPuuid(
  puuid: string,
  platform: Platform = 'na1'
): Promise<Summoner | null> {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  return riotRequest<Summoner>(url);
}

// Get summoner by summoner name (deprecated but still works)
export async function getSummonerByName(
  summonerName: string,
  platform: Platform = 'na1'
): Promise<Summoner | null> {
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`;
  return riotRequest<Summoner>(url);
}

// Get ranked stats for a summoner
export async function getRankedStats(
  summonerId: string,
  platform: Platform = 'na1'
): Promise<LeagueEntry[]> {
  const url = `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
  const result = await riotRequest<LeagueEntry[]>(url);
  return result || [];
}

// Get match history by PUUID
export async function getMatchHistory(
  puuid: string,
  region: Region = 'americas',
  count: number = 10
): Promise<string[]> {
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  const result = await riotRequest<string[]>(url);
  return result || [];
}

// Get top champion masteries by PUUID
export async function getTopChampionMasteries(
  puuid: string,
  platform: Platform = 'na1',
  count: number = 3
): Promise<ChampionMastery[]> {
  const url = `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`;
  const result = await riotRequest<ChampionMastery[]>(url);
  return result || [];
}

// Get total mastery score
export async function getTotalMasteryScore(
  puuid: string,
  platform: Platform = 'na1'
): Promise<number> {
  const url = `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/scores/by-puuid/${puuid}`;
  const result = await riotRequest<number>(url);
  return result || 0;
}

// Get detailed match data
export async function getMatchDetails(
  matchId: string,
  region: Region = 'americas'
): Promise<Match | null> {
  const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  return riotRequest<Match>(url);
}

// Main function to get complete player stats
export async function getLeagueOfLegendsStats(
  playerIdOrName: string,
  platform: Platform = 'na1'
): Promise<LoLPlayerStats | null> {
  try {
    // First, try to get summoner data
    // If playerIdOrName contains #, treat it as Riot ID (gameName#tagLine)
    let summoner: Summoner | null = null;

    if (playerIdOrName.includes('#')) {
      // New Riot ID format: gameName#tagLine
      const [gameName, tagLine] = playerIdOrName.split('#');
      const region = REGIONS[platform];

      // Get account by Riot ID
      const account = await getAccountByRiotId(gameName, tagLine, region);
      if (!account) {
        return null;
      }

      // Get summoner by PUUID
      summoner = await getSummonerByPuuid(account.puuid, platform);
    } else {
      // Legacy summoner name format
      // Try to use it as Riot ID with default tagline
      const region = REGIONS[platform];

      // First try with the summoner name as gameName and platform as tagline
      // This is a fallback for old-style summoner names
      const account = await getAccountByRiotId(playerIdOrName, platform.toUpperCase(), region);

      if (account) {
        summoner = await getSummonerByPuuid(account.puuid, platform);
      } else {
        // If that fails, try the deprecated summoner name endpoint as last resort
        summoner = await getSummonerByName(playerIdOrName, platform);
      }
    }

    if (!summoner) {
      return null;
    }

    // Get ranked stats
    const rankedStats = await getRankedStats(summoner.id, platform);

    // Get recent match history with details
    const region = REGIONS[platform];
    const matchIds = await getMatchHistory(summoner.puuid, region, 10);

    // Fetch detailed match data for recent matches
    const matchPromises = matchIds.slice(0, 10).map(matchId => getMatchDetails(matchId, region));
    const matchDetails = await Promise.all(matchPromises);
    const recentMatches = matchDetails.filter((match): match is Match => match !== null);

    // Get top 10 champion masteries
    const topChampions = await getTopChampionMasteries(summoner.puuid, platform, 10);

    // Get total mastery score
    const totalMasteryScore = await getTotalMasteryScore(summoner.puuid, platform);

    return {
      summoner,
      rankedStats,
      recentMatches,
      topChampions,
      totalMasteryScore,
    };
  } catch (error) {
    return null;
  }
}

// Helper function to parse player_id and determine platform
export function parsePlayerId(playerId: string): { name: string; platform: Platform } {
  // Expected format: "summonerName" or "summonerName@platform" or "gameName#tagLine@platform"
  // Examples: "Faker", "Faker@kr", "PlayerOne#NA1@na1", "realnightmare@EUNE"

  const parts = playerId.split('@');
  const name = parts[0];

  // Handle both uppercase and lowercase region codes
  // Convert EUNE to eun1, NA to na1, etc.
  let platformStr = parts[1] || 'na1';
  platformStr = platformStr.toLowerCase();

  // Map common region names to platform codes
  const regionMap: Record<string, Platform> = {
    'eune': 'eun1',
    'euw': 'euw1',
    'na': 'na1',
    'br': 'br1',
    'lan': 'la1',
    'las': 'la2',
    'oce': 'oc1',
    'tr': 'tr1',
  };

  const platform = (regionMap[platformStr] || platformStr) as Platform;

  return { name, platform };
}

// Get rank display string
export function getRankDisplay(entry: LeagueEntry): string {
  const queueName = entry.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex';
  const winRate = entry.wins + entry.losses > 0
    ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
    : 0;

  return `${queueName}: ${entry.tier} ${entry.rank} (${entry.leaguePoints} LP) - ${entry.wins}W ${entry.losses}L (${winRate}%)`;
}
