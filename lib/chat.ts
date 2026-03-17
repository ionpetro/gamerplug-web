import { supabase, TABLES, User } from '@/lib/supabase';

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  receiver_id?: string;
  content: string;
  message_type?: 'text' | 'image' | 'emoji';
  is_read?: boolean;
  created_at: string;
  updated_at?: string;
  sender_gamertag?: string;
  sender_avatar?: string;
  receiver_gamertag?: string;
  receiver_avatar?: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface MatchConversation extends Match {
  matched_user: User;
  last_message: Message | null;
  unread_count: number;
}

export async function getMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages_with_users')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Get messages error:', error);
    return [];
  }

  return data ?? [];
}

export async function sendMessage({
  matchId,
  senderId,
  content,
}: {
  matchId: string;
  senderId: string;
  content: string;
}): Promise<{ success: boolean; message?: Message; error?: string }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: matchId,
      sender_id: senderId,
      content,
      message_type: 'text',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Send message error:', error);
    return { success: false, error: error.message };
  }

  const { data: messageWithUsers } = await supabase
    .from('messages_with_users')
    .select('*')
    .eq('id', data.id)
    .single();

  return {
    success: true,
    message: (messageWithUsers ?? data) as Message,
  };
}

export async function markMessagesAsRead(matchId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('match_id', matchId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Mark messages as read error:', error);
  }
}

export async function getUnreadMessageCount(matchId: string, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('match_id', matchId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Unread count error:', error);
    return 0;
  }

  return count ?? 0;
}

export async function getLastMessage(matchId: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages_with_users')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Last message error:', error);
    return null;
  }

  return data;
}

export async function getMatchById(matchId: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from(TABLES.MATCHES)
    .select('*')
    .eq('id', matchId)
    .maybeSingle();

  if (error) {
    console.error('Match lookup error:', error);
    return null;
  }

  return data;
}

export async function getMatchConversations(userId: string): Promise<MatchConversation[]> {
  const { data: matches, error } = await supabase
    .from(TABLES.MATCHES)
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (error) {
    console.error('Error fetching matches:', error);
    return [];
  }

  if (!matches?.length) {
    return [];
  }

  const otherUserIds = matches.map((match) => (match.user1_id === userId ? match.user2_id : match.user1_id));

  const [{ data: users, error: usersError }, conversations] = await Promise.all([
    supabase.from(TABLES.USERS).select('*').in('id', otherUserIds),
    Promise.all(
      matches.map(async (match) => {
        const [lastMessage, unreadCount] = await Promise.all([
          getLastMessage(match.id),
          getUnreadMessageCount(match.id, userId),
        ]);

        return {
          match,
          lastMessage,
          unreadCount,
        };
      })
    ),
  ]);

  if (usersError) {
    console.error('Error fetching matched users:', usersError);
    return [];
  }

  return conversations
    .map(({ match, lastMessage, unreadCount }) => {
      const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
      const matchedUser = users?.find((candidate) => candidate.id === otherUserId);

      if (!matchedUser) {
        return null;
      }

      return {
        ...match,
        matched_user: matchedUser,
        last_message: lastMessage,
        unread_count: unreadCount,
      } satisfies MatchConversation;
    })
    .filter((conversation): conversation is MatchConversation => conversation !== null)
    .sort((left, right) => {
      const leftTime = left.last_message?.created_at ?? left.created_at;
      const rightTime = right.last_message?.created_at ?? right.created_at;
      return new Date(rightTime).getTime() - new Date(leftTime).getTime();
    });
}

export function subscribeToMessages(
  matchId: string,
  onMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      async (payload) => {
        const { data, error } = await supabase
          .from('messages_with_users')
          .select('*')
          .eq('id', payload.new.id)
          .maybeSingle();

        if (error) {
          console.error('Realtime message lookup error:', error);
          onMessage(payload.new as Message);
          return;
        }

        if (data) {
          onMessage(data);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
