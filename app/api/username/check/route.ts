import { NextRequest, NextResponse } from 'next/server';
import { supabase, TABLES } from '@/lib/supabase';

const GAMERTAG_REGEX = /^[a-zA-Z0-9_-]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { available: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    if (username.length < MIN_LENGTH) {
      return NextResponse.json({
        available: false,
        error: `Username must be at least ${MIN_LENGTH} characters`,
      });
    }

    if (username.length > MAX_LENGTH) {
      return NextResponse.json({
        available: false,
        error: `Username must be at most ${MAX_LENGTH} characters`,
      });
    }

    if (!GAMERTAG_REGEX.test(username)) {
      return NextResponse.json({
        available: false,
        error: 'Username can only contain letters, numbers, hyphens, and underscores',
      });
    }

    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('id')
      .ilike('gamertag', username)
      .is('deleted_at', null)
      .limit(1);

    if (error) {
      console.error('Error checking username:', error);
      return NextResponse.json(
        { available: false, error: 'Failed to check username availability' },
        { status: 500 }
      );
    }

    return NextResponse.json({ available: !data || data.length === 0 });
  } catch (error) {
    console.error('Error in username check:', error);
    return NextResponse.json(
      { available: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
