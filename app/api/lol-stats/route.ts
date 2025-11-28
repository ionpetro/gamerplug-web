import { NextRequest, NextResponse } from 'next/server';
import { getLeagueOfLegendsStats, parsePlayerId } from '@/lib/riot-api';

// API route to fetch League of Legends stats
// GET /api/lol-stats?playerId=playerName@platform
// Example: /api/lol-stats?playerId=Faker@kr or /api/lol-stats?playerId=PlayerName#NA1@na1

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playerId = searchParams.get('playerId');

    if (!playerId) {
      return NextResponse.json(
        { error: 'playerId parameter is required' },
        { status: 400 }
      );
    }

    // Parse the player ID to extract name and platform
    const { name, platform } = parsePlayerId(playerId);

    // Fetch stats from Riot API
    const stats = await getLeagueOfLegendsStats(name, platform);

    if (!stats) {
      return NextResponse.json(
        { error: 'Player not found or API error' },
        { status: 404 }
      );
    }

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
