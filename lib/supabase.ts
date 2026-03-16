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
  referred_by?: string | null;
  referred_by_user_id?: string | null;
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

export interface Referral {
  id: string;
  referrer: string;
  referrer_user_id?: string | null;
  email: string;
  converted: boolean;
  created_at: string;
}

export interface PlayNowMessage {
  id: string;
  game_id: string;
  user_id: string;
  gamertag: string;
  profile_image_url?: string;
  message_text: string;
  created_at: string;
}

export type PayToPlayServiceType = 'duo_queue' | 'coaching' | 'carry' | 'team_session';
export type PayToPlayBookingStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled_by_buyer'
  | 'cancelled_by_provider'
  | 'completed';

export interface PayToPlayProfile {
  user_id: string;
  headline?: string;
  about?: string;
  timezone: string;
  is_active: boolean;
  is_featured: boolean;
  featured_rank?: number;
  average_rating: number;
  total_reviews: number;
  total_completed_bookings: number;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayOffer {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  service_type: PayToPlayServiceType;
  game_name: string;
  platform?: string[];
  duration_minutes: number;
  price_cents: number;
  currency: string;
  max_party_size: number;
  instant_book: boolean;
  booking_notice_hours: number;
  cancellation_policy: 'flexible' | 'moderate' | 'strict';
  location_type: 'online' | 'discord' | 'in_game_party' | 'custom';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayAvailability {
  id: string;
  provider_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayBooking {
  id: string;
  offer_id: string;
  provider_id: string;
  buyer_id: string;
  status: PayToPlayBookingStatus;
  scheduled_start: string;
  scheduled_end: string;
  buyer_message?: string;
  total_price_cents: number;
  currency: string;
  accepted_at?: string;
  declined_at?: string;
  cancelled_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayReview {
  id: string;
  booking_id: string;
  provider_id: string;
  reviewer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayListingMedia {
  id: string;
  offer_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  sort_order: number;
  is_cover: boolean;
  created_at: string;
  updated_at: string;
}

export interface PayToPlayAvailabilitySlot {
  id: string;
  provider_id: string;
  offer_id?: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  is_booked: boolean;
  booking_id?: string;
  created_at: string;
  updated_at: string;
}

// Database table names
export const TABLES = {
  USERS: 'users',
  CLIPS: 'clips',
  GAMES: 'games',
  USER_GAMES: 'user_games',
  REFERRALS: 'referrals',
  PLAY_NOW_MESSAGES: 'play_now_messages',
  PAY_TO_PLAY_PROFILES: 'pay_to_play_profiles',
  PAY_TO_PLAY_OFFERS: 'pay_to_play_offers',
  PAY_TO_PLAY_AVAILABILITY: 'pay_to_play_availability',
  PAY_TO_PLAY_AVAILABILITY_SLOTS: 'pay_to_play_availability_slots',
  PAY_TO_PLAY_BOOKINGS: 'pay_to_play_bookings',
  PAY_TO_PLAY_LISTING_MEDIA: 'pay_to_play_listing_media',
  PAY_TO_PLAY_REVIEWS: 'pay_to_play_reviews',
  SWIPES: 'swipes',
  MATCHES: 'matches',
} as const;
