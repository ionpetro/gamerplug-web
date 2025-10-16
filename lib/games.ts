import { supabase, Game, TABLES } from './supabase';

// Enhanced game interface with additional display properties
export interface GameWithDetails extends Game {
  slug: string;
  image?: string;
  description?: string;
  playerCount?: string;
  rating?: number;
  genres?: string[];
}

// Fetch all games from Supabase
export async function getAllGames(): Promise<GameWithDetails[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.GAMES)
      .select('*')
      .order('display_name', { ascending: true });

    if (error) {
      console.error('Error fetching games:', error);
      return [];
    }

    // Transform the games to include additional display properties
    return data.map(game => transformGameForDisplay(game));
  } catch (error) {
    console.error('Error in getAllGames:', error);
    return [];
  }
}

// Fetch a specific game by slug
export async function getGameBySlug(slug: string): Promise<GameWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from(TABLES.GAMES)
      .select('*')
      .eq('name', slug)
      .single();

    if (error) {
      console.error('Error fetching game by slug:', error);
      return null;
    }

    return transformGameForDisplay(data);
  } catch (error) {
    console.error('Error in getGameBySlug:', error);
    return null;
  }
}

// Transform game data to include display properties
function transformGameForDisplay(game: Game): GameWithDetails {
  const slug = game.name;
  const iconName = game.icon_name || game.name;

  // Try multiple image formats (webp, jpg, png)
  // The actual format will be determined at runtime
  const image = getGameImagePath(iconName);

  // Game-specific data (this could be moved to database in the future)
  const gameDetails = getGameDisplayDetails(game.name);

  return {
    ...game,
    slug,
    image,
    description: gameDetails.description,
    playerCount: gameDetails.playerCount,
    rating: gameDetails.rating,
    genres: gameDetails.genres,
  };
}

// Helper function to get the correct image path with format fallback
function getGameImagePath(iconName: string): string {
  // Map of game names to their image files with extensions
  const imageMap: Record<string, string> = {
    'rocket-league': 'rocket-league.jpg',
    'rocketleague': 'rocketleague.webp',
    'battlefield-6': 'battlefield-6.jpg',
    'marvel-rivals': 'marvel-rivals.jpg',
    'call-of-duty': 'call-of-duty.png',
    'apex-legends': 'apex.webp',
    'overwatch-2': 'overwatch2.webp',
    'league-of-legends': 'lol.webp',
    'pubg': 'pubg.webp',
    'fortnite': 'fortnite.webp',
    'cs2': 'cs2.webp',
    'counter-strike-2': 'cs2.webp',
    'valorant': 'valorant.webp',
  };

  // Return mapped image or fallback to webp
  const imagePath = imageMap[iconName] || `${iconName}.webp`;
  return `/images/games/${imagePath}`;
}

// Game-specific details (could be moved to database)
function getGameDisplayDetails(gameName: string) {
  const gameDetailsMap: Record<string, {
    description: string;
    playerCount: string;
    rating: number;
    genres: string[];
  }> = {
    'apex-legends': {
      description: 'Battle Royale shooter with unique Legends and abilities',
      playerCount: '100M+',
      rating: 4.8,
      genres: ['Battle Royale', 'FPS', 'Team-based']
    },
    'overwatch-2': {
      description: 'Team-based multiplayer first-person shooter',
      playerCount: '35M+',
      rating: 4.5,
      genres: ['FPS', 'Hero Shooter', 'Team-based']
    },
    'league-of-legends': {
      description: 'Strategic multiplayer online battle arena (MOBA)',
      playerCount: '180M+',
      rating: 4.7,
      genres: ['MOBA', 'Strategy', 'Competitive']
    },
    'pubg': {
      description: 'Realistic battle royale with tactical gameplay',
      playerCount: '75M+',
      rating: 4.3,
      genres: ['Battle Royale', 'FPS', 'Realistic']
    },
    'fortnite': {
      description: 'Battle royale with building mechanics and creative modes',
      playerCount: '400M+',
      rating: 4.6,
      genres: ['Battle Royale', 'Building', 'Creative']
    },
    'cs2': {
      description: 'Tactical FPS with competitive gameplay and esports scene',
      playerCount: '30M+',
      rating: 4.4,
      genres: ['FPS', 'Tactical', 'Competitive']
    },
    'counter-strike-2': {
      description: 'Tactical FPS with competitive gameplay and esports scene',
      playerCount: '30M+',
      rating: 4.4,
      genres: ['FPS', 'Tactical', 'Competitive']
    },
    'rocket-league': {
      description: 'Soccer meets driving in this unique sports game',
      playerCount: '50M+',
      rating: 4.5,
      genres: ['Sports', 'Racing', 'Competitive']
    },
    'rocketleague': {
      description: 'Soccer meets driving in this unique sports game',
      playerCount: '50M+',
      rating: 4.5,
      genres: ['Sports', 'Racing', 'Competitive']
    },
    'valorant': {
      description: 'Tactical FPS with unique agent abilities',
      playerCount: '15M+',
      rating: 4.6,
      genres: ['FPS', 'Tactical', 'Hero Shooter']
    }
  };

  return gameDetailsMap[gameName] || {
    description: 'Popular competitive game',
    playerCount: '10M+',
    rating: 4.0,
    genres: ['Competitive']
  };
}

// Create URL-friendly slug from game name
export function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Get game icon URL
export function getGameIconUrl(iconName: string): string {
  return getGameImagePath(iconName);
}