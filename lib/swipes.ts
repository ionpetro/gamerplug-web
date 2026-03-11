import { supabase, TABLES } from '@/lib/supabase';

export interface SwipeResult {
  success: boolean;
  isMatch?: boolean;
  matchId?: string;
}

export interface ClearLeftSwipesResult {
  success: boolean;
  deletedCount: number;
}

export const swipeUser = async (
  fromUserId: string,
  toUserId: string,
  direction: 'left' | 'right'
): Promise<SwipeResult> => {
  try {
    const { error: swipeError } = await supabase
      .from(TABLES.SWIPES)
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        direction,
      });

    if (swipeError) {
      console.error('Swipe error:', swipeError);
      return { success: false };
    }

    // If it's a right swipe, check if the trigger created a match
    if (direction === 'right') {
      const { data: existingMatch, error: matchCheckError } = await supabase
        .from(TABLES.MATCHES)
        .select('id')
        .or(`and(user1_id.eq.${fromUserId},user2_id.eq.${toUserId}),and(user1_id.eq.${toUserId},user2_id.eq.${fromUserId})`)
        .single();

      if (matchCheckError && matchCheckError.code !== 'PGRST116') {
        console.error('Match check error:', matchCheckError);
        return { success: true, isMatch: false };
      }

      if (existingMatch) {
        return { success: true, isMatch: true, matchId: existingMatch.id };
      }
    }

    return { success: true, isMatch: false };
  } catch (error) {
    console.error('Swipe operation error:', error);
    return { success: false };
  }
};

export const clearLeftSwipes = async (userId: string): Promise<ClearLeftSwipesResult> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.SWIPES)
      .delete()
      .eq('from_user_id', userId)
      .eq('direction', 'left')
      .select('id');

    if (error) {
      console.error('Clear left swipes error:', error);
      return { success: false, deletedCount: 0 };
    }

    return { success: true, deletedCount: data?.length ?? 0 };
  } catch (error) {
    console.error('Clear left swipes unexpected error:', error);
    return { success: false, deletedCount: 0 };
  }
};
