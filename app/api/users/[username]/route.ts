import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Fetch user with games
    const { data: userData, error: userError } = await supabase
      .from(TABLES.USERS)
      .select(`
        *,
        user_games (
          *,
          games (*)
        )
      `)
      .eq('gamertag', username)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
