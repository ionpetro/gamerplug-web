import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

// Database Types
export interface User {
  id: string;
  steam_id?: string;
  gamertag: string;
  platform?: ('PC' | 'PS5' | 'Xbox' | 'Nintendo Switch')[];
  bio?: string;
  profile_image_url?: string;
  game_images?: string[];
  steam_profile_url?: string;
  steam_avatar_url?: string;
  age?: number;
  gender?: string;
  discord_profile?: string;
  streaming_profile?: string;
  games?: string[];
  game_preferences?: {
    gameMode?: string;
    rankType?: string;
    playStyle?: string;
    strategy?: string;
    teamPlay?: string;
    leadership?: string;
    focusType?: string;
    characterPreference?: string;
    gamingSchedule?: string;
    micUsage?: string;
    personality?: string;
    conversationStyle?: string;
    inGameTools?: string;
  };
  created_at: string;
}

export interface Clip {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  file_size?: number;
  file_type?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserGame {
  id: string;
  user_id: string;
  game_id: string;
  player_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  name: string;
  display_name: string;
  icon_name?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

// Database table names
export const TABLES = {
  USERS: 'users',
  CLIPS: 'clips',
  GAMES: 'games',
  USER_GAMES: 'user_games',
} as const;