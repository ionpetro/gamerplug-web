# Gamerplug Web

A web application for viewing gamer profiles, built with Next.js and Supabase.

## Features

- **Dynamic Profile Pages**: View user profiles at `/profile/[username]`
- **Real-time Data**: Fetches user data, games, and clips from Supabase
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: Proper loading states and error messages
- **Search Functionality**: Search for users by gamertag

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**:
   Make sure your Supabase database has the following tables:
   - `users` - User profiles with gamertags, platforms, bios, etc.
   - `clips` - User video clips with thumbnails and metadata
   - `games` - Available games in the system
   - `user_games` - Junction table linking users to their games

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Home Page
- Search for users by entering their gamertag
- Access the static demo profile

### Profile Pages
- **Static Demo**: `/profile` - Shows a demo profile with mock data
- **Dynamic Profile**: `/profile/[username]` - Fetches real user data from Supabase
  - Replace `[username]` with an actual gamertag from your database
  - Example: `/profile/ProGamer123`

### Features on Profile Pages
- User avatar, gamertag, platform, age, and bio
- List of user's games
- Grid of user's public clips
- Responsive design that adapts to desktop and mobile

## Database Schema

The app expects the following Supabase table structure:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gamertag TEXT UNIQUE NOT NULL,
  platform TEXT,
  bio TEXT,
  profile_image_url TEXT,
  age INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Games junction table
CREATE TABLE user_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clips table
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Development

- Built with **Next.js 15** and **React 19**
- Styled with **Tailwind CSS**
- Database integration with **Supabase**
- TypeScript for type safety
- Mobile-first responsive design

## Deployment

1. Set up your environment variables in your deployment platform
2. Deploy to Vercel, Netlify, or your preferred hosting platform
3. Make sure your Supabase project is configured with proper RLS policies

## Error Handling

The app includes proper error handling for:
- User not found (404-style page)
- Database connection issues
- Loading states with spinners
- Graceful fallbacks for missing data
